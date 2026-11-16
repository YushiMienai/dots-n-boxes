import {useRoomSocket} from '@hooks'
import {Loader} from '@components'

export const GameBoard = () => {
  const {gameState, isLoading, roomId} = useRoomSocket()

  if (isLoading || !gameState) {
    return <Loader title='Загрузка комнаты...' />
  }

  return (
    <div className='game-page'>
      <h1>Комната: {roomId}</h1>

      <div className='players-list'>
        {gameState.players.map(p => (
          <div key={p.id}>
            {p.name} {p.isOnline ? '🟢' : '🔴'} — {p.score}
          </div>
        ))}
      </div>

      {/* Здесь будет доска: <GameCanvas state={gameState} /> */}
    </div>
  )
}
