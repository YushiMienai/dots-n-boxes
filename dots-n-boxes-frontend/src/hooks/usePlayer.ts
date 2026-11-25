import {useNavigate} from 'react-router-dom'
import {useMutation} from '@tanstack/react-query'
import {usePlayerStore} from '@stores'
import {playerApi} from '@api'

/**
 * Вход в комнату — только HTTP.
 *
 * Что делает:
 * - PUT /player/room/:id — бэк проверяет пароль, пишет
 *   players.game_room_id в БД.
 * - enterRoom(roomId) — кладёт currentRoomId в стор.
 * - navigate(`/rooms/${roomId}`) — переход в комнату.
 *
 * Что НЕ делает:
 * - Не отправляет socket.emit('join-room'). Это делает GameBoard
 *   в useEffect при монтировании. Логика: HTTP — «можно войти» +
 *   «запомнить, где я», сокет — «я здесь, покажи меня остальным».
 *
 * Пароль передаётся в HTTP-теле. Никакой проверки на фронте —
 * только на бэке (RoomService.getRoomForEntry). Невалидный пароль
 * → 4xx от playerApi → onError → toast (через QueryClient).
 */
export const useEnterRoom = () => {
  const enterRoom = usePlayerStore(state => state.enterRoom)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({roomId, password}: {roomId: string; password?: string}) => playerApi.enterRoom(roomId, password),
    onSuccess: (_, {roomId}) => {
      enterRoom(roomId)
      navigate(`/rooms/${roomId}`)
    }
  })
}

/**
 * Выход из комнаты — только HTTP.
 *
 * Что делает:
 * - DELETE /player/room — бэк чистит players.game_room_id в БД.
 * - leaveRoom() в сторе — обнуляет currentRoomId.
 * - navigate('/rooms') — переход на список комнат.
 *
 * Что НЕ делает:
 * - Не отправляет socket.emit('leave-room'). Это делает GameBoard
 *   в cleanup useEffect при размонтировании. Логика такая:
 *   HTTP фиксирует выход в БД, а сокет отписывается от событий
 *   (socket.leave + gameManager.handlePlayerLeave) при уходе со страницы.
 *
 * Порядок важен: сначала HTTP (БД), потом размонтирование GameBoard
 * (сокет). Если сделать наоборот — GameBoard может размонтироваться
 * раньше, чем HTTP-запрос завершится, и игрок останется в GameManager
 * «фантомом» до disconnect.
 *
 * Явный выход vs закрытие вкладки:
 * - Здесь — явный выход (кнопка «Выйти»). Полное удаление игрока
 *   из game_room_id (БД) и из GameManager (через leave-room).
 * - При закрытии вкладки — useLeaveRoom НЕ вызывается. Сработает
 *   socket.disconnect → gameManager.handleDisconnect (мягкое
 *   отключение: isOnline = false, game_room_id в БД сохраняется).
 *
 * F5 не ломается: useLeaveRoom не вызывается, GameBoard
 * перемонтируется и снова отправит join-room.
 */
export const useLeaveRoom = () => {
  const leaveRoom = usePlayerStore(state => state.leaveRoom)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => playerApi.leaveRoom(),
    onSuccess: () => {
      leaveRoom()
      navigate('/rooms')
    }
  })
}
