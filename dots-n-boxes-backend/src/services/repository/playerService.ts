import {AppDataSource} from '@database'
import {PlayerEntity, RoomEntity} from '@entities'
import {RoomFullError, RoomNotFound} from '@errors'

export class PlayerService {
  private playerRepository = AppDataSource.getRepository(PlayerEntity)

  async enterRoom(playerId: string, roomId: string): Promise<void> {
    // Начинаем транзакцию
    await AppDataSource.transaction(async (manager) => {
      // Получаем репозитории из менеджера транзакции
      const playerRepo = manager.getRepository(PlayerEntity)
      const roomRepo = manager.getRepository(RoomEntity)

      // 1. Проверяем игрока с загрузкой комнаты
      const currentPlayer = await playerRepo.findOne({
        where: {id: playerId},
        relations: {gameRoom: true}  // 👈 загружаем комнату
      })

      if (currentPlayer?.gameRoom) {
        throw new Error('Player is already in a room')
      }

      // 2. Проверяем комнату с загрузкой игроков
      const room = await roomRepo.findOne({
        where: {id: roomId},
        relations: {players: true}  // 👈 загружаем игроков для подсчета
      })

      if (!room) {
        throw new RoomNotFound()
      }

      // 3. Проверяем, не полная ли комната
      if (room.players.length >= room.maxPlayers) {
        throw new RoomFullError()
      }

      // 4. Обновляем игрока
      await playerRepo.update(playerId, {
        gameRoom: room,
        joinedAt: new Date()
      })
    })
  }

  async leaveRoom(playerId: string): Promise<void> {
    await AppDataSource.transaction(async (manager) => {
      const playerRepo = manager.getRepository(PlayerEntity)
      const player = await playerRepo.findOne({
        where: {id: playerId},
        select: {gameRoomId: true}
      })

      if (!player?.gameRoomId) {
        return
      }

      await playerRepo.update(playerId, {
        gameRoomId: null,
        gameRoom: null
      })
    })
  }

  async getCurrentRoom(playerId: string): Promise<string | undefined> {
    const player = await this.playerRepository.findOne({
      where: {id: playerId},
      select: {gameRoomId: true}
    })
    return player?.gameRoomId || undefined
  }

  async getPlayersInRoom(roomId: string): Promise<PlayerEntity[]> {
    return this.playerRepository.find({
      where: {gameRoom: {id: roomId}},
      select: {id: true, name: true, isOnline: true}  // только нужные поля
    })
  }
}
