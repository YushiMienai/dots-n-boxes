import {Equal, FindOptionsWhere} from 'typeorm'
import {AppDataSource} from '@database'
import {RoomEntity} from '@entities'
import {RoomListRequestDTO, RoomRequestDTO, RoomResponseDTO} from '@dto'
import {RoomNotFound} from '@errors'

export class RoomService {
  private roomRepository = AppDataSource.getRepository(RoomEntity)

  async getList(params: RoomListRequestDTO): Promise<RoomResponseDTO[]> {
    const whereConditions: FindOptionsWhere<RoomEntity> = {}
    if (params.name) {
      whereConditions.name = Equal(params.name)
    }
    const [rooms, total] = await this.roomRepository.findAndCount({
      where: whereConditions,
      order: {createdAt: 'DESC'},
      select: ['id', 'name']
    })

    return rooms as RoomResponseDTO[]
  }

  async getRoom(id: string): Promise<RoomResponseDTO> {
    const room = await this.roomRepository.findOne({
      where: [{id}],
      select: ['name']
    })

    if (!room) {
      throw new RoomNotFound()
    }

    return room as RoomResponseDTO
  }

  async createRoom(room: RoomRequestDTO): Promise<RoomResponseDTO> {
    return await this.roomRepository.save(room)
  }
}