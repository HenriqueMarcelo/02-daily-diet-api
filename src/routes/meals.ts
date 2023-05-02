import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  // app.get(
  //   '/',
  //   {
  //     preHandler: [checkSessionIdExists],
  //   },
  //   async (request) => {
  //     const { sessionId } = request.cookies

  //     const users = await knex('users').where('session_id', sessionId).select()

  //     return {
  //       users,
  //     }
  //   },
  // )

  // app.get(
  //   '/:id',
  //   {
  //     preHandler: [checkSessionIdExists],
  //   },
  //   async (request) => {
  //     const { sessionId } = request.cookies

  //     const getUsersParamsSchema = z.object({
  //       id: z.string().uuid(),
  //     })

  //     const { id } = getUsersParamsSchema.parse(request.params)

  //     const user = await knex('users')
  //       .where({ id, session_id: sessionId })
  //       .first()

  //     return {
  //       user,
  //     }
  //   },
  // )

  // app.get(
  //   '/summary',
  //   {
  //     preHandler: [checkSessionIdExists],
  //   },
  //   async (request) => {
  //     const { sessionId } = request.cookies

  //     const summary = await knex('users')
  //       .where('session_id', sessionId)
  //       .sum('amount', {
  //         as: 'amount',
  //       })
  //       .first()

  //     return { summary }
  //   },
  // )

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
      when: z.coerce.date(),
    })

    const { name, description, inDiet, when } = createUserBodySchema.parse(
      request.body,
    )

    const userId = 'a'

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      in_diet: inDiet,
      when,
      user_id: userId,
    })

    reply.status(201).send()
  })
}
