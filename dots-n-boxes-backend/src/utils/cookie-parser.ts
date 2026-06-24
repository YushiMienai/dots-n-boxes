import {FastifyRequest} from 'fastify'

export function getCookie(request: FastifyRequest, name: string): string | undefined {
  const cookieHeader = request.headers.cookie
  console.log(request.headers)
  if (!cookieHeader) return

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookies[name]
}
