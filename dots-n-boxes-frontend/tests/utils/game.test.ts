import {describe, it, expect} from 'vitest'
import {getPlayerColor, calculateScores} from '@utils'
import {FREE_LINE, PLAYER_COLORS} from '@config'
import {ICell, ILine, IPlayer} from '@types'

// Моковые данные для тестов
const mockPlayers: IPlayer[] = [
  {id: 'player-1', name: 'Анна', isOnline: true, score: '0'},
  {id: 'player-2', name: 'Борис', isOnline: false, score: '0'},
]

const dummyLine: ILine = {lineId: 'h-0-0', ownerId: null}
const createCell = (ownerId: string | null): ICell => ({
  top: dummyLine,
  bottom: dummyLine,
  left: dummyLine,
  right: dummyLine,
  ownerId,
})

describe('getPlayerColor', () => {
  it('возвращает цвет свободной линии, если ownerId равен null', () => {
    expect(getPlayerColor(null, mockPlayers)).toBe(FREE_LINE)
  })

  it('возвращает цвет из PLAYER_COLORS по индексу игрока', () => {
    expect(getPlayerColor('player-1', mockPlayers)).toBe(PLAYER_COLORS[0])
    expect(getPlayerColor('player-2', mockPlayers)).toBe(PLAYER_COLORS[1])
  })

  it('возвращает FREE_LINE для системных линий и неизвестных ID', () => {
    expect(getPlayerColor('system', mockPlayers)).toBe(FREE_LINE)
    expect(getPlayerColor('unknown-id', mockPlayers)).toBe(FREE_LINE)
  })
})

describe('calculateScores', () => {
  it('возвращает пустой объект, если ни одна клетка не захвачена', () => {
    const cells = [createCell(null), createCell(null)]
    expect(calculateScores(cells)).toEqual({})
  })

  it('корректно подсчитывает очки для каждого игрока', () => {
    const cells = [
      createCell('player-1'),
      createCell('player-2'),
      createCell('player-1'),
      createCell(null),
    ]

    expect(calculateScores(cells)).toEqual({
      'player-1': 2,
      'player-2': 1,
    })
  })

  it('игнорирует системного владельца (system)', () => {
    const cells = [
      createCell('system'),
      createCell('player-1'),
    ]

    expect(calculateScores(cells)).toEqual({
      'player-1': 1,
    })
  })
})
