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
  return {makeMove}
}
