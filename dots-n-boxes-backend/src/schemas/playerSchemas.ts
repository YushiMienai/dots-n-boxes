export const enterRoomSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {type: 'string'}
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: {type: 'boolean'},
        message: {type: 'string'}
      }
    }
  }
}

export const leaveRoomSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        success: {type: 'boolean'},
        message: {type: 'string'}
      }
    }
  }
}
