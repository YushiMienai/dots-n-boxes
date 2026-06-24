import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    eslint(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, './src/api'),
      '@types': path.resolve(__dirname, './src/types'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@router': path.resolve(__dirname, './src/router'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@config': path.resolve(__dirname, './src/config'),
      '@game': path.resolve(__dirname, './src/game'),
      '@styles': path.resolve(__dirname, './src/styles/index.css'),
      '@svg': path.resolve(__dirname, './src/types/svg')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts'
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: false,
    cors: true
  }
})
