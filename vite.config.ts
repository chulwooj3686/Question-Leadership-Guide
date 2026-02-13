import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Vercel의 Environment Variable을 process.env.API_KEY로 접근할 수 있게 매핑
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});