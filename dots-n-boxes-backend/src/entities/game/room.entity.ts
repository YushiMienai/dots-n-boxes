import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn} from 'typeorm'
import {PlayerEntity} from './player.entity'
import {GameStateEntity} from './gameState.entity'
import {IGameState, IPlayer} from '@types'

@Entity('game_rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: 'varchar', length: 100})
  name: string

  @Column({type: 'varchar', length: 100, select: false, default: ''})
  password: string | null

  @Column({type: 'int', default: 2})
  maxPlayers: number

  @Column({type: 'text', default: 'public'})
  accessLevel: string

  @Column({type: 'boolean', default: false})
  isGameStarted: boolean

  @Column({type: 'boolean', default: false})
  isGameFinished: boolean

  @OneToMany(() => PlayerEntity, player => player.gameRoom)
  players: IPlayer[]

  @OneToOne(() => GameStateEntity, gameState => gameState.gameRoom)
  gameState: IGameState

  @CreateDateColumn({type: 'timestamptz'})
  createdAt: Date
}
