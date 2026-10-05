import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const configuredKey = env.__APITUBE_API_KEY__ || '';
  const apiKey = configuredKey.trim().replace(/^(['"])(.*)\1;?$/s, '$2').trim();

  return {
    plugins: [react()],
    define: {
      __APITUBE_API_KEY__: JSON.stringify(apiKey),
    },
  };
});
