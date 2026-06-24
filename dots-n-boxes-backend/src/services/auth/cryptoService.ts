import * as crypto from 'crypto'

export class CryptoService {
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  static generateRandomToken(): string {
    return crypto.randomBytes(40).toString('hex')
  }
}