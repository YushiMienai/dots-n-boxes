import {z} from 'zod'

// ===== Базовые схемы =====

const errorSchema = z.object({
  error: z.string(),
  message: z.string().optional()
})

export const roomResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  isPrivate: z.boolean(),
  maxPlayers: z.number(),
  isGameStarted: z.boolean(),
  createdAt: z.date().transform(date => date.toISOString())
})

// ===== Общие схемы для ответов =====

const responses = {
  success: roomResponseSchema,
  badRequest: errorSchema,
  notFound: errorSchema.extend({
    resource: z.string().optional()
  }),
  conflict: errorSchema.extend({
    existingUser: z.string().optional()
  })
}

const roomBody = z.object({
  name: z.string()
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(50, 'Название должно содержать максимум 50 символов'),
  maxPlayers: z.number()
    .min(2, 'Минимум 2 игрока')
    .max(4, 'Максимум 4 игрока')
    .default(2),
  isPrivate: z.boolean().default(false)
})

// ===== Схемы для эндпоинтов =====

export const roomSchemas = {
  getList: {
    querystring: z.object({
      name: z.string().optional(),
      maxPlayers: z.number().min(2).max(4).optional(),
      isPrivate: z.boolean().optional()
    }),
    response: {
      200: z.array(roomResponseSchema),
      400: responses.badRequest
    }
  },

  getOne: {
    params: z.object({
      id: z.uuid('Неверный формат ID')
    }),
    response: {
      200: roomResponseSchema,
      400: responses.badRequest,
      404: responses.notFound
    }
  },

  create: {
    body: roomBody,
    response: {
      201: roomResponseSchema,
      400: responses.badRequest,
      409: responses.conflict
    }
  },

  update: {
    params: z.object({
      id: z.uuid('Неверный формат ID')
    }),
    body: roomBody,
    response: {
      200: roomResponseSchema,
      400: responses.badRequest,
      404: responses.notFound
    }
  },

  delete: {
    params: z.object({
      id: z.uuid('Неверный формат ID')
    }),
    response: {
      204: z.void(),
      400: responses.badRequest,
      404: responses.notFound
    }
  }
}

// ===== Типы =====

export type RoomSearch = z.infer<typeof roomSchemas.getList.querystring>
export type RoomRequest = z.infer<typeof roomBody>
export type RoomResponse = z.infer<typeof roomResponseSchema>
export type RoomParams = z.infer<typeof roomSchemas.getOne.params>
