import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // The HR app is mounted by the main AzentMart app under /agent-apps/hr/.
    // Relative asset URLs make the compiled bundle work from that nested path.
    base: './',

    plugins: [react()],

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
    },

    server: {
      proxy: {
        '/hr-api': {
          target: env.VITE_DEV_API_PROXY_TARGET || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  };
});
