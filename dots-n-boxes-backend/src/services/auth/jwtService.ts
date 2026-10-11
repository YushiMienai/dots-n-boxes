import {SignJWT, jwtVerify} from 'jose'
import {PlayerEntity} from '@entities'
import {JWT_SECRET_BYTES} from '@constants'

export interface JWTPayload {
  id: string
  name: string
}

export class JwtService {
  async signAccessToken(player: PlayerEntity): Promise<string> {
    return await new SignJWT({id: player.id, name: player.name})
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || '15m')
      .sign(JWT_SECRET_BYTES)  // ← из @constants, не свой
  }

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    const {payload} = await jwtVerify<JWTPayload>(token, JWT_SECRET_BYTES, {
      algorithms: ['HS256'],
    })
    return payload
  }
}
