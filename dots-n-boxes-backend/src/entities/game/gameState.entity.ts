import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne} from 'typeorm'
import {IGameState, ILine, ICell} from '@types'
import {EGameStatus} from 'types/enum'
import {PlayerEntity} from './player.entity'
import {RoomEntity} from './room.entity'

@Entity('game_states')
export class GameStateEntity implements IGameState {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: 'jsonb'})
  horizontalLines: ILine[]

  @Column({type: 'jsonb'})
  verticalLines: ILine[]

  @Column({type: 'jsonb'})
  cells: ICell[]

  @Column({
    type: 'enum',
    enum: EGameStatus,
    default: EGameStatus.WAITING
  })
  status: EGameStatus

  @ManyToOne(() => PlayerEntity, {nullable: true})
  @Column({type: 'uuid', nullable: true})
  activePlayerId: string

  @ManyToOne(() => PlayerEntity, {nullable: true})
  @Column({type: 'uuid', nullable: true})
  winnerId: string

  @OneToOne(() => RoomEntity, gameRoom => gameRoom.gameState, {onDelete: 'CASCADE'})
  @JoinColumn()
  gameRoom: RoomEntity

  @Column({type: 'uuid'})
  gameRoomId: string
}
