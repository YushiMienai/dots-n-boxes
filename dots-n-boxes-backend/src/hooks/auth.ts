import {FastifyRequest, FastifyReply} from 'fastify'
import {jwtVerify} from 'jose'
import {JWT_SECRET_BYTES} from '@constants' // Путь к вашему секрету

// Определяем тип полезной нагрузки
export interface JWTPayload {
  id: string
  name: string
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization

    // 1. Проверяем наличие заголовка
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({error: 'Missing or invalid Authorization header'})
    }

    // 2. Извлекаем токен
    const token = authHeader.substring(7)

    // 3. Верифицируем с помощью jose
    const {payload} = await jwtVerify<JWTPayload>(
      token,
      JWT_SECRET_BYTES,
      {
        algorithms: ['HS256'], // Важно: ограничиваем алгоритмы для безопасности [citation:15]
        // Если нужно, можно добавить issuer/audience
      }
    )

    // 4. Записываем пользователя в request
    request.player = payload

  } catch (err) {
    // jose кидает специфичные ошибки (JWTExpired, JWSInvalid и т.д.)
    // Можно залогировать err.code для отладки
    return reply.status(401).send({error: 'Unauthorized'})
  }
}
