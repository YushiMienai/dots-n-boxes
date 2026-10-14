import 'dotenv/config'  // ← первый импорт, до всего остального
import 'tsconfig-paths/register'
import {startServer} from '@app'
import {AppDataSource} from '@database'

async function main() {
  const app = await startServer()

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`)
    await new Promise<void>((resolve) => app.io.close(() => resolve()))
    await app.close()
    await AppDataSource.destroy()
    process.exit(0)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main().catch((err) => {
  console.error('Ошибка запуска сервера:', err)
  process.exit(1)
})
