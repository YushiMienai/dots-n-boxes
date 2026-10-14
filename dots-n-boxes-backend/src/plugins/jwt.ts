import {FastifyInstance} from 'fastify'
import fp from 'fastify-plugin'
import {JwtService} from '@services'

declare module 'fastify' {
  interface FastifyInstance {
    jwtService: JwtService
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const jwtService = new JwtService()
  fastify.decorate('jwtService', jwtService)
}, {name: 'jwt'})
