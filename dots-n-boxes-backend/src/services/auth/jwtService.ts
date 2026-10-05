import {SignJWT, jwtVerify} from 'jose'
import {PlayerEntity} from '@entities'

export interface JWTPayload {
  id: string
  name: string
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export class JwtService {
  async signAccessToken(player: PlayerEntity): Promise<string> {
    return await new SignJWT({
      id: player.id,
      name: player.name,
    })
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || '15m')
      .sign(secret)
  }

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    const {payload} = await jwtVerify<JWTPayload>(token, secret, {
      algorithms: ['HS256'],
    })
    return payload
  }
}
