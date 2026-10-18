import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget =
    env.VITE_BACKEND_TARGET ||
    env.VITE_API_URL ||
    'https://store-backend-taupe-six.vercel.app';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase') || id.includes('@firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            if (
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('/react/')
            ) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
};
});

