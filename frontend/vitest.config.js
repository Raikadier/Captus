import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    // Bundle @testing-library/* through Vite so our React aliases apply to them
    server: {
      deps: {
        inline: [
          '@testing-library/react',
          '@testing-library/dom',
          '@testing-library/jest-dom',
          '@testing-library/user-event',
        ],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Point JSX compilation at the SAME React that @testing-library/react uses
      // (root/node_modules/react v19) to avoid "multiple React copies" error.
      // @testing-library/react v16 is hoisted to root and resolves React 19 there.
      'react': path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
      'react-dom/client': path.resolve(__dirname, '../node_modules/react-dom/client'),
      'react/jsx-runtime': path.resolve(__dirname, '../node_modules/react/jsx-runtime'),
      'react/jsx-dev-runtime': path.resolve(__dirname, '../node_modules/react/jsx-dev-runtime'),
    },
    dedupe: ['react', 'react-dom'],
  },
})
