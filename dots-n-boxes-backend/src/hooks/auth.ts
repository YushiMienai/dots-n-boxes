import {FastifyRequest, FastifyReply} from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify(): Promise<{id: string; name: string}>
    player?: {id: string, name: string}
  }
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    request.player = await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({error: 'Unauthorized'})
    throw err
  }
}
