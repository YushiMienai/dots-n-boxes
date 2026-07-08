import {Equal, FindOptionsWhere} from 'typeorm'
import {AppDataSource} from '@database'
import {RoomEntity} from '@entities'
import {RoomNotFound} from '@errors'
import {CreateRoomBody, RoomSearch} from '@schemas'

export class RoomService {
  private roomRepository = AppDataSource.getRepository(RoomEntity)

  async getList(params: RoomSearch): Promise<RoomEntity[]> {
    const whereConditions: FindOptionsWhere<RoomEntity> = {}
    if (params.name) {
      whereConditions.name = Equal(params.name)
    }
    const [rooms, total] = await this.roomRepository.findAndCount({
      where: whereConditions,
      order: {createdAt: 'DESC'},
      select: ['id', 'name', 'isPrivate', 'maxPlayers', 'isGameStarted', 'createdAt'],
    })

    return rooms
  }

  async getRoom(id: string): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({
      where: [{id}],
      select: ['name']
    })

    if (!room) {
      throw new RoomNotFound()
    }

    return room
  }

  async createRoom(room: CreateRoomBody): Promise<RoomEntity> {
    return await this.roomRepository.save(room)
  }
}
