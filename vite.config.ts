import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { addCspMeta } from './src/security/csp.ts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // The dev server needs inline scripts for hot reload, so only built pages get the CSP.
    {
      name: 'love-iteration-csp',
      apply: 'build',
      transformIndexHtml: addCspMeta,
    },
  ],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
