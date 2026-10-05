import 'fastify'
import {JWTPayload} from '@hooks' // Или откуда-то, где определен тип

declare module 'fastify' {
  interface FastifyRequest {
    player?: JWTPayload
  }
}