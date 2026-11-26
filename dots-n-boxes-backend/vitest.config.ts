import {defineConfig} from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@entities': path.resolve(__dirname, './src/entities'),
      '@errors': path.resolve(__dirname, './src/errors'),
      '@types': path.resolve(__dirname, './src/types'),
      '@database': path.resolve(__dirname, './src/database'),
      '@services': path.resolve(__dirname, './src/services'),
      '@app': path.resolve(__dirname, './src/app'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@middleware': path.resolve(__dirname, './src/middleware'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@schemas': path.resolve(__dirname, './src/schemas'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
      '@hooks': path.resolve(__dirname, './src/hooks')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    // constants.ts падает без JWT_SECRET — задаём фиктивное значение для тестов
    env: {
      JWT_SECRET: 'test-secret-do-not-use-in-production'
    },
    include: ['tests/**/*.test.ts'],
    clearMocks: true
  }
})
