import {AppDataSource} from '@database'
import {RoomEntity} from '@entities'
import {RoomNotFound} from '@errors'
import {RoomRequest, RoomSearch} from '@schemas'

/**
 * Комната с посчитанным количеством игроков.
 * Агрегат нужен для API (`roomResponseSchema.currentPlayersCount`),
 * но НЕ хранится в БД и НЕ должен попадать в game-state.
 */
export type RoomWithCount = RoomEntity & {currentPlayersCount: number}

export class RoomService {
  private roomRepository = AppDataSource.getRepository(RoomEntity)

  async getList(params: RoomSearch): Promise<RoomWithCount[]> {
    const qb = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.players', 'player')
      .addSelect([
        'room.id',
        'room.name',
        'room.accessLevel',
        'room.maxPlayers',
        'room.boardSize',
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

  /**
   * Для игровой логики (GameManager). НЕ содержит currentPlayersCount —
   * это агрегат для API, в game-state ему не место.
   */
  async getRoom(id: string): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({
      where: [{id}],
      relations: {players: true}
    })

    if (!room) {
      throw new RoomNotFound()
    }

    return room
  }

  async createRoom(room: RoomRequest): Promise<RoomWithCount> {
    const created = await this.roomRepository.save(room)
    return {...created, currentPlayersCount: 0}
  }

  async getRoomWithPassword(id: string): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({
      where: {id},
      select: {
        id: true,
        name: true,
        accessLevel: true,
        maxPlayers: true,
        boardSize: true,
        password: true
      },
    })

    if (!room) {
      throw new RoomNotFound()
    }

    return room
  }
}
