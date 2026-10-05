import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import CATEGORY_IDS from './src/api/categoryIds.js';
import { normalizeNewsLanguages } from './src/api/languages.js';

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
            const languages = normalizeNewsLanguages(requestUrl.searchParams.get('languages'));
            requestUrl.searchParams.delete('category');
            requestUrl.searchParams.delete('languages');
            requestUrl.pathname = category === 'world'
              ? '/v1/news/everything'
              : CATEGORY_IDS[category]
                ? `/v1/news/category/iptc_mediatopics/${CATEGORY_IDS[category]}`
                : '/v1/news/top-headlines';
            requestUrl.searchParams.set('language.code', languages.join(','));
            requestUrl.searchParams.set('sort.by', 'published_at');
            requestUrl.searchParams.set('sort.order', 'desc');

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
