export const authSchemas = {
  register: {
    body: {
      type: 'object',
      required: ['name', 'password'],
      properties: {
        name: {
          type: 'string',
          minLength: 3,
          maxLength: 20,
          pattern: '^[a-zA-Z0-9_]+$'
        },
        password: {type: 'string', minLength: 6, maxLength: 100}
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          token: {type: 'string'},
        }
      }
    }
  },
  login: {
    body: {
      type: 'object',
      required: ['name', 'password'],
      properties: {
        username: {type: 'string'},
        password: {type: 'string'}
      }
    }
  }
}
