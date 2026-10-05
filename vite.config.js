import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import CATEGORY_IDS from './src/api/categoryIds.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const configuredKey = env.__APITUBE_API_KEY__ || '';
  const apiKey = configuredKey.trim().replace(/^(['"])(.*)\1;?$/s, '$2').trim();

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/news': {
          target: 'https://api.apitube.io',
          changeOrigin: true,
          rewrite: (path) => {
            const requestUrl = new URL(path, 'http://localhost');
            const category = requestUrl.searchParams.get('category');
            requestUrl.searchParams.delete('category');
            requestUrl.pathname = CATEGORY_IDS[category]
              ? `/v1/news/category/iptc_mediatopics/${CATEGORY_IDS[category]}`
              : '/v1/news/top-headlines';

            return `${requestUrl.pathname}${requestUrl.search}`;
          },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyRequest) => {
              if (apiKey) proxyRequest.setHeader('X-API-Key', apiKey);
            });
          },
        },
      },
    },
  };
});
