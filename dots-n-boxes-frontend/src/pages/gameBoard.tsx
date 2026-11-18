import {useGameMoves, useRoomSocket} from '@hooks'
import {GameCanvas, GameCard, Loader} from '@components'

export const GameBoard = () => {
  const {gameState, isLoading, roomId} = useRoomSocket()
  const {makeMove} = useGameMoves({roomId})

  if (isLoading || !gameState || !roomId) {
    return <Loader title='Загрузка комнаты...' />
  }

  return (
    <div className='game-page'>
      <GameCard
        roomId={roomId}
        gameState={gameState}
      />
      <GameCanvas
        gameState={gameState}
        currentPlayer={gameState.players[0]}
        onLineClick={makeMove}
        isMobile={false}
      />
    </div>
  )
}
