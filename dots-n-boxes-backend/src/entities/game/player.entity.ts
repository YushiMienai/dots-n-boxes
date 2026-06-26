import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn} from 'typeorm'
import {RoomEntity} from './room.entity'
import {IPlayer} from '@types'

@Entity('players')
export class PlayerEntity implements IPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: 'varchar', length: 50})
  name: string

  @Column({type: 'varchar', length: 100, select: false})
  password: string

  @Column({type: 'boolean', default: true})
  isOnline: boolean

  @ManyToOne(() => RoomEntity, room => room.players, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  gameRoom: RoomEntity | null

  @Column({type: 'uuid'})
  gameRoomId: string | null

  @CreateDateColumn({type: 'timestamptz'})
  joinedAt: Date

  toJSON(): IPlayer {
    return {
      id: this.id,
      name: this.name,
      isOnline: this.isOnline,
      gameRoomId: this.gameRoomId
    }
  }
}