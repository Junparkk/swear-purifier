interface AdBannerProps {
  position?: 'top' | 'bottom';
}

export function AdBanner({ position = 'bottom' }: AdBannerProps) {
  return (
    <div
      className={`w-full min-h-[90px] flex items-center justify-center ${
        position === 'bottom' ? 'mt-8 pb-5' : 'mb-0'
      }`}
    >
      {/*
        AdSense 코드 삽입 위치:
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
    </div>
  );
}
