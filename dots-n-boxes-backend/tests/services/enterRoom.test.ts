import {describe, it, expect, vi, beforeEach} from 'vitest'
import {PlayerService} from '@services'
import {AppDataSource} from '@database'
import {PlayerEntity} from '@entities'
import {RoomFullError, RoomNotFound} from '@errors'

type MockRepo = {
  findOne: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
  count: ReturnType<typeof vi.fn>
}

let playerRepo: MockRepo
let roomRepo: MockRepo

beforeEach(() => {
  playerRepo = {findOne: vi.fn(), update: vi.fn(), count: vi.fn()}
  roomRepo = {findOne: vi.fn(), update: vi.fn(), count: vi.fn()}

  vi.spyOn(AppDataSource, 'transaction').mockImplementation(async (cb: unknown) => {
    const manager = {
      getRepository: (entity: unknown) =>
        entity === PlayerEntity ? playerRepo : roomRepo
    }
    return (cb as (m: typeof manager) => Promise<unknown>)(manager)
  })
})

describe('PlayerService.enterRoom', () => {
  it('бросает RoomNotFound, если комнаты нет', async () => {
    playerRepo.findOne.mockResolvedValue({id: 'p1', gameRoom: null})
    roomRepo.findOne.mockResolvedValue(null)
    await expect(new PlayerService().enterRoom('p1', 'room-x')).rejects.toBeInstanceOf(RoomNotFound)
  })

  it('бросает RoomFullError, если в комнате уже maxPlayers', async () => {
    playerRepo.findOne.mockResolvedValue({id: 'p1', gameRoom: null})
    roomRepo.findOne.mockResolvedValue({id: 'room-x', maxPlayers: 2, isGameStarted: false, players: [{id: 'a'}, {id: 'b'}]})
    await expect(new PlayerService().enterRoom('p1', 'room-x')).rejects.toBeInstanceOf(RoomFullError)
  })

  it('бросает ошибку, если игрок уже в комнате', async () => {
    playerRepo.findOne.mockResolvedValue({id: 'p1', gameRoom: {id: 'other-room'}})
    await expect(new PlayerService().enterRoom('p1', 'room-x')).rejects.toThrow('Player is already in a room')
  })

  it('заходит в комнату, где есть место', async () => {
    playerRepo.findOne.mockResolvedValue({id: 'p1', gameRoom: null})
    roomRepo.findOne.mockResolvedValue({id: 'room-x', maxPlayers: 2, isGameStarted: false, players: [{id: 'a'}]})
    await new PlayerService().enterRoom('p1', 'room-x')
    expect(playerRepo.update).toHaveBeenCalledWith('p1', expect.objectContaining({gameRoom: expect.objectContaining({id: 'room-x'})}))
  })

  it('заходит в пустую комнату (0 игроков)', async () => {
    playerRepo.findOne.mockResolvedValue({id: 'p1', gameRoom: null})
    roomRepo.findOne.mockResolvedValue({id: 'room-x', maxPlayers: 2, isGameStarted: false, players: []})
    await expect(new PlayerService().enterRoom('p1', 'room-x')).resolves.toBeUndefined()
    expect(playerRepo.update).toHaveBeenCalledTimes(1)
  })

  it('граница: players.length === maxPlayers - 1 — пропускает', async () => {
    playerRepo.findOne.mockResolvedValue({id: 'p1', gameRoom: null})
    roomRepo.findOne.mockResolvedValue({id: 'room-x', maxPlayers: 2, isGameStarted: false, players: [{id: 'a'}]})
    await expect(new PlayerService().enterRoom('p1', 'room-x')).resolves.toBeUndefined()
  })

  it('граница: players.length === maxPlayers — отсекает', async () => {
    playerRepo.findOne.mockResolvedValue({id: 'p1', gameRoom: null})
    roomRepo.findOne.mockResolvedValue({id: 'room-x', maxPlayers: 2, isGameStarted: false, players: [{id: 'a'}, {id: 'b'}]})
    await expect(new PlayerService().enterRoom('p1', 'room-x')).rejects.toBeInstanceOf(RoomFullError)
  })
})
