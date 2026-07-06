import {z} from 'zod'

export const RoomResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  isPrivate: z.boolean(),
  maxPlayers: z.number(),
  isGameStarted: z.boolean(),
  createdAt: z.date().transform(date => date.toISOString())
})

export const RoomParamsSchema = z.object({
  id: z.uuid('Неверный формат ID')
})

export const RoomSearchSchema = z.object({
  name: z.string().optional(),
  maxPlayers: z.number().min(2).max(4).optional(),
  isPrivate: z.boolean().optional()
})

export const createRoomSchema = z.object({
  name: z.string()
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(50, 'Название должно содержать максимум 50 символов'),
  maxPlayers: z.number()
    .min(2, 'Минимум 2 игрока')
    .max(4, 'Максимум 4 игрока')
    .default(2),
  isPrivate: z.boolean().default(false)
})

export type RoomSearch = z.infer<typeof RoomSearchSchema>
export type RoomResponse = z.infer<typeof RoomResponseSchema>
export type CreateRoomBody = z.infer<typeof createRoomSchema>
