import fp from 'fastify-plugin'
import {TokenService} from '@services'
import {AppDataSource} from '@database'
import {RefreshTokenEntity} from '@entities'

declare module 'fastify' {
  interface FastifyInstance {
    tokenService: TokenService
  }
}

export default fp(async (fastify) => {
  const tokenRepo = AppDataSource.getRepository(RefreshTokenEntity)
  const tokenService = new TokenService(fastify.jwtService, tokenRepo)
  fastify.decorate('tokenService', tokenService)
}, {
  name: 'token',
  dependencies: ['jwt']
})
