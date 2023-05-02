import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createuserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createuserBodySchema.parse(request.body)

    const id = randomUUID()

    await knex('users').insert({
      id,
      name,
      email,
    })

    reply.status(201).send({
      id,
    })
  })
}
