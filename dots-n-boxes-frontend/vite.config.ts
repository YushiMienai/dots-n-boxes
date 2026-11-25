import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
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
      '@router': path.resolve(__dirname, './src/router.tsx'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@config': path.resolve(__dirname, './src/config'),
      '@game': path.resolve(__dirname, './src/game'),
      '@styles': path.resolve(__dirname, './src/styles/index.css'),
      '@svg': path.resolve(__dirname, './src/types/svg'),
      '@constants': path.resolve(__dirname, './src/types/constants')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setup-vitest.ts'
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: false,
    cors: true,
    watch: {
      // Не следить за node_modules и сборками — меньше I/O на Windows
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    }
  }
})
