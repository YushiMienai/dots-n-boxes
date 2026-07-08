import {FastifyInstance} from 'fastify'
import {MoreThan, Repository} from 'typeorm'
import {PlayerEntity, RefreshTokenEntity} from '@entities'
import {CryptoService} from 'services/auth/cryptoService'
import {JwtService} from 'services/auth/jwtService'

interface Metadata {
  userAgent?: string
  ipAddress?: string
}

export class TokenService {
  constructor(
    private jwtService: JwtService,
    private refreshTokenRepo: Repository<RefreshTokenEntity>
  ) {}

  async generate(player: PlayerEntity, metadata: Metadata): Promise<{accessToken: string, refreshToken: string}> {
    const accessToken = this.jwtService.signAccessToken(player)

    const refreshToken = CryptoService.generateRandomToken()
    const hashedRefreshToken = CryptoService.hashToken(refreshToken)

    const created = await this.refreshTokenRepo.save({
      tokenHash: hashedRefreshToken,
      playerId: player.id,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    if (!created) {
      throw new Error('Error creating refresh token')
    }

    return {accessToken, refreshToken}
  }

  async validateRefreshToken(refreshToken: string): Promise<RefreshTokenEntity | null> {
    const hashedRefreshToken = CryptoService.hashToken(refreshToken)
    const tokenRecord = await this.refreshTokenRepo.findOne({
      where: {
        tokenHash: hashedRefreshToken,
        isRevoked: false
      },
      relations: ['player']
    })

    if (!tokenRecord) {
      throw new Error('Token not found')
    }

    return tokenRecord
  }

  async revokeRefreshToken(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) {
      const tokenHash = CryptoService.hashToken(refreshToken)
      const foundToken = await this.refreshTokenRepo.findOne({where: {tokenHash}})
      if (foundToken) {
        foundToken.isRevoked = true
        await this.refreshTokenRepo.save(foundToken)
      }
    }
  }
}
