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
    const qb = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.players', 'player')
      .addSelect([
        'room.id',
        'room.name',
        'room.accessLevel',
        'room.maxPlayers',
        'room.isGameStarted',
        'room.createdAt',
      ])
      .addSelect('COUNT(player.id)', 'currentPlayersCount')
      .groupBy('room.id')
      .orderBy('room.createdAt', 'DESC')

    if (params.name) {
      qb.andWhere('room.name = :name', {name: params.name})
    }

    const {entities, raw} = await qb.getRawAndEntities()

    return entities.map((room, index) => ({
      ...room,
      currentPlayersCount: Number(raw[index].currentPlayersCount),
    }))
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
        password: true
      },
    })

    if (!room) {
      throw new RoomNotFound()
    }

    return room
  }
}
