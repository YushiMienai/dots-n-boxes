import {Equal, FindOptionsWhere} from 'typeorm'
import {AppDataSource} from '@database'
import {RoomEntity} from '@entities'
import {RoomNotFound} from '@errors'
import {RoomRequest, RoomSearch} from '@schemas'

const ROOM_SELECT = {
  id: true,
  name: true,
  accessLevel: true,
  maxPlayers: true,
  isGameStarted: true,
  createdAt: true,
} as const

export class RoomService {
  private roomRepository = AppDataSource.getRepository(RoomEntity)

  async getList(params: RoomSearch): Promise<RoomEntity[]> {
    const whereConditions: FindOptionsWhere<RoomEntity> = {}
    if (params.name) {
      whereConditions.name = Equal(params.name)
    }
    const [rooms] = await this.roomRepository.findAndCount({
      where: whereConditions,
      order: {createdAt: 'DESC'},
      select: ROOM_SELECT,
    })

    return rooms
  }

  async getRoom(id: string): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({
      where: [{id}],
      select: ROOM_SELECT
    })

    if (!room) {
      throw new RoomNotFound()
    }

    return room
  }

  async createRoom(room: RoomRequest): Promise<RoomEntity> {
    console.info(room)
    return await this.roomRepository.save(room)
  }

  async getRoomForEntry(id: string): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({
      where: {id},
      select: {
        id: true,
        name: true,
        accessLevel: true,
        maxPlayers: true,
        isGameStarted: true,
        password: true,   // ← только здесь
      },
    })

    if (!room) {
      throw new RoomNotFound()
    }

    return room
  }
}
