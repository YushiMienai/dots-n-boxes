import 'reflect-metadata'
import {DataSource} from 'typeorm'
import {config} from 'config'

export const AppDataSource = new DataSource(config.db)

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize()

    const pendingMigrations = await AppDataSource.showMigrations()
    if (pendingMigrations) {
      // Запускаем миграции
      await AppDataSource.runMigrations()
      console.log('Migrations executed successfully')
    } else {
      console.log('✅ Database is up to date')
    }
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}