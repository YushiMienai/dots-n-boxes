import {toast} from 'react-hot-toast'
import {socket} from '@utils'
import {MoveResponse} from '@types'

interface UseGameMovesProps {
  roomId: string | undefined
}

export const useGameMoves = ({roomId}: UseGameMovesProps) => {
  const makeMove = (lineId: string) => {
    if (!roomId) return
    socket.emit('move', {roomId, lineId}, (res: MoveResponse) => {
      if (!res.success) toast.error(res.error)
    })
  }

  const resetRequest = () => {
    if (!roomId) return
    socket.emit('reset-request', {roomId}, (res: MoveResponse)=> {
      if (res.success) console.log('reset')
      else toast.error(res.error)
    })
  }

  const resetAnswer = (answer: boolean) => {
    if (!roomId) return
    socket.emit('reset-answer', {roomId, answer}, (res: MoveResponse)=> {
      if (res.success) console.log('resetAnswer')
      else toast.error(res.error)
    })
  }

  return {makeMove, resetRequest, resetAnswer}
}
