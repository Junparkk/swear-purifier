import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'swear-purifier',
  brand: {
    displayName: '욕 순화기',
    primaryColor: '#ff6eb4',
    icon: 'https://swear-purifier.vercel.app/icon.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite --host',   // granite dev가 내부적으로 실행하는 명령 (순환 참조 방지)
      build: 'vite build',  // ait build가 내부적으로 실행하는 명령
    },
  },
  permissions: [],
  outdir: 'dist',
});
