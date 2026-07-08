import {z} from 'zod'

const requestBody = z.object({
  name: z.string()
    .min(3, 'Имя должно содержать минимум 3 символа')
    .max(20, 'Имя должно содержать максимум 20 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Имя должно только буквы, цифры и подчёркивание'),
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(100, 'Пароль должен содержать максимум 100 символов')
})

const responseBody = z.object({
  name: z.string(),
  accessToken: z.string()
})

const errorBody = z.object({
  error: z.string(),
  message: z.string().optional()
})

export const authSchemas = {
  register: {
    body: requestBody,
    response: {
      201: responseBody,
      400: errorBody,
      409: errorBody.extend({existingUser: z.string()})
    }
  },
  login: {
    body: requestBody,
    response: {
      200: responseBody,
      400: errorBody,
      401: errorBody.extend({reason: z.string().optional()})
    }
  }
}

export type AuthRequest = z.infer<typeof requestBody>
export type AuthResponse = z.infer<typeof responseBody>
