import {AppError} from './appErrors'

export class RoomNotFound extends AppError {
  constructor() {
    super('Room not found', 404, 'ROOM_NOT_FOUND')
  }
}

export class RoomFullError extends AppError {
  constructor() {
    super('Room is full', 409, 'ROOM_IS_FULL')
  }
}


