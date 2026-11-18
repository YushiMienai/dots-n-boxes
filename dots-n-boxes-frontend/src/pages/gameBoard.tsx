import {useGameMoves, useRoomSocket} from '@hooks'
import {GameCanvas, GameCard, Loader, ResetConfirmModal} from '@components'

export const GameBoard = () => {
  const {gameState, isLoading, roomId, askResetConfirm, setAskResetConfirm} = useRoomSocket()
  const {makeMove, resetAnswer, resetRequest} = useGameMoves({roomId})

  if (isLoading || !gameState || !roomId) {
    return <Loader title='Загрузка комнаты...' />
  }

  return (
    <div className='game-page'>
      <GameCard
        roomId={roomId}
        gameState={gameState}
        reset={resetRequest}
      />
      <GameCanvas
        gameState={gameState}
        currentPlayer={gameState.players[0]}
        onLineClick={makeMove}
        isMobile={false}
      />
      <ResetConfirmModal
        isOpen={askResetConfirm}
        onConfirm={() => {
          resetAnswer(true)
          setAskResetConfirm(false)
        }}
        onDecline={() => {
          resetAnswer(false)
          setAskResetConfirm(false)
        }}
      />
    </div>
  )
}
