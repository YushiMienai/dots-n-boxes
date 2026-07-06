import {ZodError, ZodType} from 'zod'
import {FastifyRequest, FastifyReply} from 'fastify'

export function validate<T extends ZodType>(
  schema: T,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      if (source === 'body') request.body = schema.parse(request.body)
      if (source === 'query') request.query = schema.parse(request.query)
      if (source === 'params') request.params = schema.parse(request.params)

    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues
        return reply.status(400).send({
          statusCode: 400,
          error: 'Validation Error',
          message: issues.map(e => e.message).join(', '),
          errors: issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        })
      }
      throw error
    }
  }
}