import {IGameState} from '@types'
import {calculateScores, getPlayerColor} from '@utils'
import {useMemo} from 'react'

interface GameCardProps {
  roomId: string
  gameState: IGameState
  reset: () => void
}

export const GameCard = ({gameState, reset}: GameCardProps) => {
  const scores = useMemo(() => calculateScores(gameState.cells), [gameState.cells])

  return (
    <div className="game-card">
      <div className="game-header">
        <div>Комната: <strong>{gameState.roomName}</strong></div>
        <button
          type="button"
          onClick={reset}
          className={'reset-btn is-confirm'}
        >
           Сбросить
        </button>
      </div>

      <div className="players-list">
        {gameState.players.map((player, idx) => {
          const isTurn = idx === gameState.activePlayerIndex
          const playerColor = getPlayerColor(player.id, gameState.players)

          return (
            <div
              key={player.id}
              className={`player-item ${isTurn ? 'is-active' : ''} ${!player.isOnline ? 'is-offline' : ''}`}
              style={{'--player-color': playerColor} as React.CSSProperties}
            >
              <div className="player-info">
                <span className="color-dot" />
                <span className="player-name">{player.name}</span>
                <span
                  className={`status-dot ${player.isOnline ? 'online' : 'offline'}`}
                  title={player.isOnline ? 'В сети' : 'Не в сети'}
                />
              </div>

              <div className="player-score">
                Счёт: <strong>{scores[player.id] ?? 0}</strong>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
