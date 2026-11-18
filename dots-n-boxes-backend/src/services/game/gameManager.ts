import {EGameStatus, ICell, IGameState, ILine, IPlayer} from '@types'
import {BOARD_SIZE} from '@constants'
import {RoomService} from '../repository/roomService'
import {findClosedCells, isBorderLine} from '@utils'

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

  private createInitialGameState(roomId: string, roomName: string, maxPlayers: number): IGameState {
    const SYSTEM_ID = 'system'
    // Генерируем все линии
    const horizontalLines: ILine[] = []
    for (let row = 0; row <= BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        horizontalLines.push({lineId: `h-${row}-${col}`, ownerId: [0, 10].includes(row) ? SYSTEM_ID : null})
      }
    }

    const verticalLines: ILine[] = []
    for (let col = 0; col <= BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        verticalLines.push({lineId: `v-${col}-${row}`, ownerId: [0, 10].includes(col) ? SYSTEM_ID : null})
      }
    }

    // Генерируем клетки
    const cells: ICell[] = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        // Находим линии по их ID
        const top = horizontalLines.find(l => l.lineId === `h-${row}-${col}`)!
        const bottom = horizontalLines.find(l => l.lineId === `h-${row + 1}-${col}`)!
        const left = verticalLines.find(l => l.lineId === `v-${col}-${row}`)!
        const right = verticalLines.find(l => l.lineId === `v-${col + 1}-${row}`)!

        cells.push({
          top,
          bottom,
          left,
          right,
          ownerId: null,
        })
      }
    }

    return {
      roomId,
      roomName,
      players: [],
      maxPlayers,
      activePlayerIndex: 0,
      cells,
      horizontalLines,
      verticalLines,
      status: EGameStatus.WAITING,
      winnerId: null,
      resetVoteYes: 0
    }
  }

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
      const room = await this.roomService.getRoom(roomId)
      if (!room) throw new Error('Room not found')

      game = this.createInitialGameState(roomId, room.name, room.maxPlayers)
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

    game.players.push({...player, socketId, isOnline: true})

    if (game.players.length === game.maxPlayers) {
      game.status = EGameStatus.IN_PROGRESS
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
  async handleMove(roomId: string, lineId: string, socketId: string): Promise<IGameState> {
    const game = this.games.get(roomId)
    if (!game) throw new Error('Game not found')
    if (game.status !== EGameStatus.IN_PROGRESS) throw new Error('Not in progress')

    const player = game.players.find(p => p.socketId === socketId)
    if (!player) throw new Error('Player not in game')
    if (game.activePlayerIndex !== game.players.indexOf(player)) throw new Error('Not your turn')

    // Проверка, что линия не проведена
    const isHorizontal = lineId.startsWith('h-')
    const lines = isHorizontal ? game.horizontalLines : game.verticalLines
    const line = lines.find(l => l.lineId === lineId)

    if (!line) throw new Error('Line not found')
    if (line.ownerId !== null) throw new Error('Line already drawn')

    // Добавляем
    line.ownerId = player.id

    // Проверяем закрытые клетки
    const closedCells = findClosedCells(lineId, game)
    console.log(closedCells)
    closedCells.forEach(cell => cell.ownerId = player.id)

    // Смена activePlayerIndex
    if (closedCells.length === 0) {
      game.activePlayerIndex = (game.activePlayerIndex + 1) % game.players.length
    }

    // Проверка конца
    const totalLines = game.horizontalLines.filter(l => l.ownerId !== null).length
      + game.verticalLines.filter(l => l.ownerId !== null).length
    const borderLines = 2 * BOARD_SIZE * 2  // 4 стороны, но крайние — не внутренние
    const maxLines = 2 * BOARD_SIZE * (BOARD_SIZE + 1) - borderLines  // только внутренние

    // На самом деле проще: игра закончена, если все внутренние линии проведены
    const allInternalLinesDrawn = [...game.horizontalLines, ...game.verticalLines]
      .filter(l => !isBorderLine(l.lineId, BOARD_SIZE))
      .every(l => l.ownerId !== null)

    if (allInternalLinesDrawn) {
      game.status = EGameStatus.FINISHED
      const scores = game.players.map(p => ({
        id: p.id,
        count: game.cells.filter(c => c.ownerId === p.id).length,
      }))
      const maxScore = Math.max(...scores.map(s => s.count))
      const winners = scores.filter(s => s.count === maxScore)
      game.winnerId = winners.length === 1 ? winners[0].id : null
    }

    return game
  }

  async handleReset(roomId: string, answer: boolean) {
    const game = this.games.get(roomId)
    if (!game) throw new Error('Game not found')

    if (answer) game.resetVoteYes++
    else {
      game.resetVoteYes = 0
      return game
    }

    if (game.resetVoteYes === game.players.length - 1) {
      const newGame = this.createInitialGameState(roomId, game.roomName, game.maxPlayers)
      newGame.players = game.players
      newGame.status = EGameStatus.IN_PROGRESS
      this.games.set(roomId, newGame)
      return newGame
    }

    return game
  }
}
