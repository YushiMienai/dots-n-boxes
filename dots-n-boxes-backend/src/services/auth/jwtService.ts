import {PlayerEntity} from '@entities'
import {JWT} from '@fastify/jwt'

export class JwtService {
  constructor(private jwt: JWT) {}

  signAccessToken(player: PlayerEntity): string {
    return this.jwt.sign({id: player.id, name: player.name})
  }
}
