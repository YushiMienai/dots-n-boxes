export const getRoomsListSchema = {
  params: {
    type: 'object',
    properties: {
      name: {type: 'string'}
    }
  }
}

export const getRoomByIdSchema = {
  params: {
    type: 'object',
    properties: {
      id: {type: 'string'}
    },
    required: ['id']
  }
}

export const createRoomSchema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50
      },
      maxPlayers: {
        type: 'number',
        minimum: 2,
        maximum: 4,
        default: 2
      }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        name: {type: 'string'},
        maxPlayers: {type: 'number'},
        isGameStarted: {type: 'boolean'},
        createdAt: {type: 'string'}
      }
    }
  }
}