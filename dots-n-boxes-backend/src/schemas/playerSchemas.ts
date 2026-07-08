import {z} from 'zod'

const successBody = z.object({
  success: z.boolean(),
  message: z.string()
})

const playerBody = z.object({
  id: z.uuid(),
  name: z.string(),
  isOnline: z.boolean(),
  roomId: z.uuid()
})

export const playerSchema = {
  enter: {
    params: z.object({
      id: z.uuid('Неверный формат ID')
    }),
    response: {
      200: successBody
    }
  },

  leave: {
    response: {
      200: successBody
    }
  }
}

export type PlayerResponse = z.infer<typeof playerBody>
