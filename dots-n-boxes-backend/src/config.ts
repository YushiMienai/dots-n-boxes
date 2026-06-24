import {DataSourceOptions} from 'typeorm'
import {SnakeNamingStrategy} from 'typeorm-naming-strategies'
import path from 'path'

interface Config {
  db: DataSourceOptions
  server: {
    port: number
    host: string
  }
}

export const config: Config = {
  db: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'dots_and_boxes',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    entities: [path.join(__dirname, 'entities/**/*.entity.ts')],
    migrations: [path.join(__dirname, 'migrations/**/*.ts')],
    migrationsRun: false,
    namingStrategy: new SnakeNamingStrategy()
  },
  server: {
    port: parseInt(process.env.SERVER_PORT || '8000'),
    host: process.env.SERVER_HOST || '0.0.0.0'
  }
}
