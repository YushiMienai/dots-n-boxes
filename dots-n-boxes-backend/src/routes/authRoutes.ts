import {authSchemas} from './authSchemas'
import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify'
import {AuthService, JwtService, PlayerService, TokenService} from '@services'
import {AuthRequestDTO, AuthResponseDTO, RegisterRequestDTO} from '@dto'
import {getCookie} from 'utils'
import {InvalidTokenError} from '@errors'
import console from 'console'

declare module 'fastify' {
  interface FastifyInstance {
    authService: AuthService
    tokenService: TokenService
    playerService: PlayerService
    jwtService: JwtService
  }
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{Body: RegisterRequestDTO, Reply: AuthResponseDTO}>('/register',
    {schema: authSchemas.register},
    async (request: FastifyRequest, reply: FastifyReply): Promise<AuthResponseDTO> => {
      const {name, password} = request.body as RegisterRequestDTO
      const player = await fastify.authService.register({name, password})
      const {accessToken, refreshToken} = await fastify.tokenService.generate(player, {
        userAgent: request.headers['user-agent'],
        ipAddress: request.ip
      })
      reply.code(201)
      reply.header('Set-Cookie',
        `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=None`
      )
      return {name: player.name, accessToken}
    }
  )

  fastify.post('/login',
    {schema: authSchemas.login},
    async (request: FastifyRequest, reply: FastifyReply): Promise<AuthResponseDTO> => {
      const {name, password} = request.body as AuthRequestDTO
      const player = await fastify.authService.login({name, password})
      const {accessToken, refreshToken} = await fastify.tokenService.generate(player, {
        userAgent: request.headers['user-agent'],
        ipAddress: request.ip
      })
      reply.code(200)
      reply.header('Set-Cookie',
        `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=None`
      )
      return {name: player.name, accessToken}
    }
  )

  fastify.delete('/logout', async (request, reply) => {
    const refreshToken = getCookie(request, 'refreshToken')

    if (refreshToken) {
      const foundToken = await fastify.tokenService.validateRefreshToken(refreshToken)
      console.log(foundToken)

      if (foundToken) {
        await fastify.playerService.leaveRoom(foundToken.player.id)
      }

      await fastify.tokenService.revokeRefreshToken(refreshToken)
    }

    reply.header('Set-Cookie', 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly')

    return {success: true}
  })

  fastify.post('/refresh',
    async (request, reply) => {
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

      const accessToken = fastify.jwtService.signAccessToken(player)

      return {accessToken}
    }
  )

  // Без схемы - только аутентификация
  /*fastify.get('/profile',
    {preHandler: fastify.authenticate},
    authController.getProfile
  )*/
}