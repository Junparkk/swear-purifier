import { useEffect, useRef, useState } from 'react';
import { TossAds } from '@apps-in-toss/web-framework';

// 배너형 광고 그룹 ID — 토스 개발자 콘솔에서 발급 (예: ait.v2.live.xxxxxxxxxxxxxxxx)
const BANNER_AD_GROUP_ID =
  import.meta.env.VITE_AIT_BANNER_AD_GROUP_ID || 'ait-ad-test-banner-id';

// TossAds.initialize는 앱 전체에서 한 번만 호출
let tossAdsInitialized = false;

function isBannerSupported(): boolean {
  try {
    return TossAds.attachBanner.isSupported() === true;
  } catch {
    return false;
  }
}

/**
 * AIT 환경에서만 렌더링되는 배너 광고 컴포넌트.
 * 웹(Vercel) 환경에서는 null을 반환해 아무것도 표시하지 않음.
 */
export function TossAdsBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const destroyRef = useRef<(() => void) | undefined>(undefined);
  const [supported, setSupported] = useState(false);

  // 마운트 후 AIT 지원 여부 확인 (SSR 안전)
  useEffect(() => {
    setSupported(isBannerSupported());
  }, []);

  useEffect(() => {
    if (!supported || !containerRef.current) return;

    const attachAd = () => {
      if (!containerRef.current) return;
      try {
        const result = TossAds.attachBanner(BANNER_AD_GROUP_ID, containerRef.current, {
          theme: 'dark',
          variant: 'expanded',
        });
        destroyRef.current = result.destroy;
      } catch {}
    };

    if (tossAdsInitialized) {
      attachAd();
    } else {
      try {
        TossAds.initialize({
          callbacks: {
            onInitialized: () => {
              tossAdsInitialized = true;
              attachAd();
            },
            onInitializationFailed: () => {
              // 초기화 실패 시 조용히 무시
            },
          },
        });
      } catch {}
    }

    return () => {
      destroyRef.current?.();
      destroyRef.current = undefined;
    };
  }, [supported]);

  if (!supported) return null;

  return (
    <div
      className="w-full rounded-lg overflow-hidden mb-3.5"
      style={{ minHeight: 60 }}
      ref={containerRef}
    />
  );
}
