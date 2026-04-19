import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'swear-purifier',
  brand: {
    displayName: '화가났지만 나는 어른이니까',
    primaryColor: '#ff6eb4',
    icon: 'https://swear-purifier.vercel.app/favicon.png',
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
