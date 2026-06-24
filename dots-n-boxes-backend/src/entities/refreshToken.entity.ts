import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {IRefreshToken} from 'types/auth'
import {PlayerEntity} from 'entities/game/player.entity'

@Entity('refresh_tokens')
export class RefreshTokenEntity implements IRefreshToken {
  @PrimaryGeneratedColumn('increment')
  id: string

  @Column({type: 'varchar', length: 64, unique: true})
  tokenHash: string

  @Column({type: 'uuid'})
  playerId: string

  @ManyToOne(() => PlayerEntity)
  @JoinColumn({name: 'player_id'})
  player: PlayerEntity

  @Column({type: 'text'})
  userAgent: string

  @Column({type: 'inet'})
  ipAddress: string

  @Column({type: 'boolean', default: false})
  isRevoked: boolean

  @CreateDateColumn({type: 'timestamptz'})
  issuedAt: Date

  @Column({type: 'timestamptz'})
  expiresAt: Date

  @Column({type: 'timestamptz'})
  lastUsedAt: Date
}