import {AppDataSource} from '@database'
import {PlayerEntity, RoomEntity} from '@entities'

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
        relations: ['gameRoom']  // 👈 загружаем комнату
      })

      if (currentPlayer?.gameRoom) {
        throw new Error('Player is already in a room')
      }

      // 2. Проверяем комнату с загрузкой игроков
      const room = await roomRepo.findOne({
        where: { id: roomId },
        relations: ['players']  // 👈 загружаем игроков для подсчета
      })

      if (!room) {
        throw new Error('Room not found')
      }

      // 3. Проверяем, не полная ли комната
      if (room.players.length >= room.maxPlayers) {
        throw new Error('Room is full')
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
      const roomRepo = manager.getRepository(RoomEntity)

      // 1. Находим игрока с его комнатой
      const player = await playerRepo.findOne({
        where: { id: playerId },
        relations: ['gameRoom']
      })

      if (!player?.gameRoom) {
        return
      }

      const roomId = player.gameRoom.id

      // 2. Убираем игрока из комнаты
      await playerRepo.update(playerId, {
        gameRoomId: null,
        gameRoom: null
      })

      // 3. Проверяем, остались ли игроки в комнате
      const roomWithPlayers = await roomRepo.findOne({
        where: { id: roomId },
        relations: ['players']
      })

      // 4. Если комната опустела - сбрасываем состояние
      if (roomWithPlayers && roomWithPlayers.players.length === 0) {
        await roomRepo.update(roomId, {
          isGameStarted: false,
          isGameFinished: false
        })
      }
    })
  }

  async getCurrentRoom(playerId: string): Promise<string | null> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ['gameRoom']
    })
    return player?.gameRoom?.id || null
  }

  async getPlayersInRoom(roomId: string): Promise<PlayerEntity[]> {
    return this.playerRepository.find({
      where: {gameRoom: {id: roomId}},
      select: ['id', 'name', 'isOnline']  // только нужные поля
    })
  }
}