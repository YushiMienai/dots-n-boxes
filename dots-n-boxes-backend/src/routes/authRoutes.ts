import {FastifyInstance} from 'fastify'
import {getCookie} from '@utils'
import {PlayerService} from '@services'
import {InvalidTokenError} from '@errors'
import {AuthRequest, AuthResponse, authSchemas} from '@schemas'
import {validate} from '@middleware'

declare module 'fastify' {
  interface FastifyInstance {
    playerService: PlayerService
  }
}

export async function authRoutes(fastify: FastifyInstance) {
  const secureHeaderPart = process.env.NODE_ENV === 'development' ? '' : 'Secure; SameSite=None'
  fastify.post<{Body: AuthRequest, Reply: AuthResponse}>('/register',
    {preHandler: validate(authSchemas.register.body, 'body')},
    async (request, reply): Promise<AuthResponse> => {
      const {name, password} = request.body
      const player = await fastify.authService.register({name, password})
      const {accessToken, refreshToken} = await fastify.tokenService.generate(player, {
        userAgent: request.headers['user-agent'],
        ipAddress: request.ip
      })
      reply.code(201)
      reply.header('Set-Cookie',
        `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; ${secureHeaderPart}`
      )
      return {name: player.name, accessToken}
    }
  )

  fastify.post<{Body: AuthRequest, Reply: AuthResponse}>('/login',
    {preHandler: validate(authSchemas.login.body, 'body')},
    async (request, reply): Promise<AuthResponse> => {
      const {name, password} = request.body
      const player = await fastify.authService.login({name, password})
      const {accessToken, refreshToken} = await fastify.tokenService.generate(player, {
        userAgent: request.headers['user-agent'],
        ipAddress: request.ip
      })
      const roomId = await fastify.playerService.getCurrentRoom(player.id)
      reply.header('Set-Cookie',
        `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; ${secureHeaderPart}`
      )
      return {name: player.name, accessToken, roomId}
    }
  )

  fastify.delete('/logout', async (request, reply) => {
    const refreshToken = getCookie(request, 'refreshToken')

    if (refreshToken) {
      await fastify.tokenService.revokeRefreshToken(refreshToken)
    }

    reply.header('Set-Cookie', 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly')

    return {success: true}
  })

  fastify.post('/refresh',
    async (request) => {
      const refreshToken = getCookie(request, 'refreshToken')

      if (!refreshToken) {
        throw new InvalidTokenError()
      }

      const foundToken = await fastify.tokenService.validateRefreshToken(refreshToken)

      if (!foundToken) {
        throw new Error('No refresh token found')
      }

      const player = await fastify.authService.getPlayer(foundToken.playerId)

      if (!player) {
        throw new Error('No player found')
      }

      const accessToken = await fastify.jwtService.signAccessToken(player)

      return {accessToken}
    }
  )

  // Без схемы - только аутентификация
  /*fastify.get('/profile',
    {preHandler: fastify.authenticate},
    authController.getProfile
  )*/
}
