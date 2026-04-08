declare function gtag(...args: unknown[]): void;

export function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    gtag('event', name, params ?? {});
  } catch {
    // GA4 미로드 시 무시
  }
}
