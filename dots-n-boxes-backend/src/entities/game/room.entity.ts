import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn} from 'typeorm'
import {PlayerEntity} from 'entities/game/player.entity'
import {GameStateEntity} from 'entities/game/gameState.entity'
import {IGameRoom, IGameState} from '@types'
import {IPlayer} from 'types/game'

@Entity('game_rooms')
export class RoomEntity implements IGameRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: 'varchar', length: 100})
  name: string

  @Column({type: 'varchar', length: 100, default: ''})
  password: string

  @Column({type: 'int', default: 2})
  maxPlayers: number

  @Column({type: 'boolean', default: false})
  isPrivate: boolean

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

  toJSON(): IGameRoom {
    return {
      id: this.id,
      name: this.name,
      maxPlayers: this.maxPlayers,
      isPrivate: this.isPrivate,
      players: this.players,
      gameState: this.gameState,
      createdAt: this.createdAt
    }
  }
}