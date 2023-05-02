import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export interface FastifyRequestAuth extends FastifyRequest {
  user: {
    id: string
    name: string
    email: string
  }
}

export async function checkUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestAuth = request as FastifyRequestAuth
  const bearerHeader = requestAuth.headers.authorization

  if (!bearerHeader) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }

  const bearer = bearerHeader.split(' ')
  const bearerToken = bearer[1]

  const user = await knex('users')
    .where({
      id: bearerToken,
    })
    .first()

  if (!user) {
    return reply.status(403).send({
      error: 'Forbidden.',
    })
  }

  requestAuth.user = user
}
