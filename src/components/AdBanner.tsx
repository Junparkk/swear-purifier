import { useEffect, useRef } from 'react';

interface AdBannerProps {
  position?: 'bottom' | 'top';
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ position = 'bottom' }: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden ${position === 'bottom' ? 'mt-2' : 'mb-2'}`} style={{ minHeight: 60 }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7032107225843281"
        data-ad-slot=""
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
