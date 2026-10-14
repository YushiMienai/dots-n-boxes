import fp from 'fastify-plugin'
import {AuthService} from '@services'
import {AppDataSource} from '@database'
import {PlayerEntity} from '@entities'

declare module 'fastify' {
  interface FastifyInstance {
    authService: AuthService
  }
}

export default fp(async (fastify) => {
  const playerRepo = AppDataSource.getRepository(PlayerEntity)
  const authService = new AuthService(playerRepo)
  fastify.decorate('authService', authService)
}, {name: 'auth'})
