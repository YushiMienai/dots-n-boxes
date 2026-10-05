import {AppError} from './appErrors'

export class RoomNotFound extends AppError {
  constructor() {
    super('Room not found', 404, 'ROOM_NOT_FOUND')
  }
}
