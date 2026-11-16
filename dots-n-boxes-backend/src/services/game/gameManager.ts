import {EGameStatus, IGameState, IPlayer} from '@types'
import {COLORS} from '@constants'
import {RoomService} from '../repository/roomService'

/**
 * Менеджер активных игр в памяти.
 *
 * Единственный источник правды для «кто в какой комнате сейчас».
 * Не знает про io (рассылка — в socket.ts) и не пишет в БД
 * (кроме RoomService.getRoom для maxPlayers).
 *
 * Map<roomId, IGameState> — состояние теряется при рестарте сервера.
 * Для восстановления — снапшоты в БД (game_states), пока не реализовано.
 */
export class GameManager {
  private games = new Map<string, IGameState>()

  constructor(private roomService: RoomService) {}

  /**
   * Добавляет игрока в активную игру.
   *
   * Если игры для roomId ещё нет — создаёт её из данных БД (через RoomService).
   * Если игрок с таким playerId уже в игре — обновляет socketId (F5/переподключение),
   * не плодя дубли.
   *
   * Бросает 'Room not found', если комнаты нет в БД.
   * Бросает 'Room is full', если в комнате maxPlayers игроков.
   *
   * @returns актуальный IGameState (для рассылки через io.emit('game-state'))
   */
  async handlePlayerJoin(roomId: string, player: IPlayer, socketId: string): Promise<IGameState> {
    // добавить игрока в состояние игры
    let game = this.games.get(roomId)
    if (!game) {
      const room = await this.roomService.getRoom(roomId)  // ← из БД
      if (!room) throw new Error('Room not found')

      game = {
        roomId,
        players: [],
        maxPlayers: room.maxPlayers,
        activePlayerId: null,
        winnerId: null,
        cells: [],
        horizontalLines: [],
        verticalLines: [],
        status: EGameStatus.WAITING
      }
      this.games.set(roomId, game)
    }

    // Если этот playerId уже в комнате — обновляем socketId (переподключение)
    const existingPlayer = game.players.find(p => p.id === player.id)
    if (existingPlayer) {
      existingPlayer.socketId = socketId
      existingPlayer.isOnline = true
      return game
    }

    if (game.players.length >= game.maxPlayers) {
      throw new Error('Room is full')
    }

    const color = COLORS[game.players.length]
    game.players.push({...player, socketId, isOnline: true, color})

    if (game.players.length === game.maxPlayers) {
      game.status = EGameStatus.IN_PROGRESS
      game.activePlayerId = game.players[0].id // первый ходит
    }

    return game
  }

  /**
   * Жёсткий выход: игрок удаляется из игры.
   * Используется при socket.emit('leave-room') — явный выход.
   *
   * Игрок удаляется из game.players. Если это был последний
   * игрок — игра удаляется из Map.
   *
   * Вызывается ТОЛЬКО после HTTP DELETE /player/room (БД уже
   * обнулена). GameManager не трогает БД.
   *
   * @returns IGameState (для остальных) или null, если игра удалена
   */
  async handleLeaveRoom(socketId: string): Promise<IGameState | null> {
    for (const [roomId, game] of this.games) {
      const player = game.players.find(p => p.socketId === socketId)
      if (!player) continue

      game.players = game.players.filter(p => p.socketId !== socketId)

      if (game.players.length === 0) {
        this.games.delete(roomId)
        return null
      }

      return game
    }
    return null
  }

  /**
   * Мягкое отключение: игрок остаётся в игре с isOnline: false.
   *
   * Используется при socket.disconnect (F5, обрыв сети).
   * Не удаляет игрока — он вернётся через handlePlayerJoin
   * с тем же playerId, и счёт/цвет сохранятся.
   *
   * Удаляет игру из Map, только если все игроки офлайн
   * (обычно не срабатывает при F5, потому что новый socket
   *  приходит раньше, чем старый disconnect — см. race condition).
   *
   * @returns IGameState (для io.emit) или null, если сокет не в игре
   */
  async handleDisconnect(socketId: string): Promise<IGameState | null> {
    for (const [roomId, game] of this.games) {
      const player = game.players.find(p => p.socketId === socketId)
      if (!player) continue

      player.socketId = null
      player.isOnline = false

      // Если все отключились — удаляем игру
      const anyOnline = game.players.some(p => p.socketId !== null)
      if (!anyOnline) {
        this.games.delete(roomId)
        return null
      }

      return game
    }
    return null
  }

  getState(roomId: string): IGameState | null {
    return this.games.get(roomId) ?? null
  }

  /**
   * Обработать ход игрока.
   *
   * Пока не реализовано. Когда будет — план:
   * 1. Проверить, что игра IN_PROGRESS и activePlayerId === socketId.
   * 2. Проверить валидность линии (не проведена, между соседними точками).
   * 3. Добавить линию в horizontalLines/verticalLines.
   * 4. Найти замкнутые клетки — присвоить owner, увеличить score.
   * 5. Если игрок закрыл клетку — ход остаётся у него.
   *    Иначе — activePlayerId = следующий.
   * 6. Проверить конец игры (все линии проведены).
   *
   * Возвращает IMoveResult (дельта) — socket.ts разошлёт через
   * io.emit('move-made', delta). НЕ полный game-state — 10×10
   * слишком большой для каждого хода (~75 КБ).
   */
  async handleMove(roomId: string, move: unknown, socketId: string) {
    // обработать ход, проверить валидность, обновить состояние
    // отправить обновление через io.to(roomId).emit(...)
    throw new Error('Not implemented')
  }
}
