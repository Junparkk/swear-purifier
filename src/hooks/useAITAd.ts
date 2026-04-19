import { useEffect, useRef } from 'react';
import { GoogleAdMob } from '@apps-in-toss/web-framework';

// 프로덕션 AIT 광고 그룹 ID는 .env에 VITE_AIT_AD_GROUP_ID로 설정
// 토스 개발자 콘솔에서 발급받은 ID를 넣으세요 (예: ait.v2.live.xxxxxxxxxxxxxxxx)
const AD_GROUP_ID =
  import.meta.env.VITE_AIT_AD_GROUP_ID || 'ait-ad-test-interstitial-id';

const AD_RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  DELAYS_MS: [1000, 3000, 5000],
} as const;

function isAITSupported(): boolean {
  try {
    return GoogleAdMob.loadAppsInTossAdMob.isSupported() === true;
  } catch {
    return false;
  }
}

export function useAITAd() {
  const adLoadedRef = useRef(false);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const loadAd = () => {
    if (!isAITSupported()) return;

    cleanupRef.current?.();
    cleanupRef.current = undefined;
    adLoadedRef.current = false;

    try {
      const cleanup = GoogleAdMob.loadAppsInTossAdMob({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === 'loaded') {
            adLoadedRef.current = true;
            retryCountRef.current = 0;
          }
        },
        onError: () => {
          adLoadedRef.current = false;
          if (retryCountRef.current < AD_RETRY_CONFIG.MAX_ATTEMPTS) {
            const delay = AD_RETRY_CONFIG.DELAYS_MS[retryCountRef.current] ?? 5000;
            retryTimeoutRef.current = setTimeout(() => {
              retryCountRef.current += 1;
              loadAd();
            }, delay);
          } else {
            retryCountRef.current = 0;
          }
        },
      });
      cleanupRef.current = cleanup;
    } catch {}
  };

  useEffect(() => {
    loadAd();
    return () => {
      cleanupRef.current?.();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  /**
   * AIT 환경에서 광고를 표시하고, 닫히거나 실패하면 resolve.
   * AIT 미지원 환경(Vercel 웹)에서는 즉시 resolve.
   */
  const showAdIfReady = (): Promise<void> => {
    return new Promise((resolve) => {
      try {
        let canShow = false;
        try {
          canShow = GoogleAdMob.showAppsInTossAdMob.isSupported() === true;
        } catch {}

        if (!canShow || !adLoadedRef.current) {
          resolve();
          return;
        }

        GoogleAdMob.showAppsInTossAdMob({
          options: { adGroupId: AD_GROUP_ID },
          onEvent: (event) => {
            if (event.type === 'dismissed' || event.type === 'failedToShow') {
              resolve();
              loadAd(); // 다음 광고 미리 로드
            }
          },
          onError: () => {
            resolve();
            loadAd();
          },
        });
      } catch {
        resolve();
      }
    });
  };

  return { showAdIfReady };
}
