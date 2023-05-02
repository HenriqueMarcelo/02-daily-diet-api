import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
// import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    // {
    //   preHandler: [checkSessionIdExists],
    // },
    async (request) => {
      // const { sessionId } = request.cookies
      // const meals = await knex('meals').where('session_id', sessionId).select()

      const meals = await knex('meals').select()

      return {
        meals,
      }
    },
  )

  app.get(
    '/:id',
    // {
    //   preHandler: [checkSessionIdExists],
    // },
    async (request) => {
      // const { sessionId } = request.cookies

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({
          id,
          // , session_id: sessionId
        })
        .first()

      return {
        meal,
      }
    },
  )

  app.delete(
    '/:id',
    // {
    //   preHandler: [checkSessionIdExists],
    // },
    async (request, response) => {
      // const { sessionId } = request.cookies

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      await knex('meals')
        .where({
          id,
          // , session_id: sessionId
        })
        .delete()

      response.status(204)
    },
  )

  app.put(
    '/:id',
    // {
    //   preHandler: [checkSessionIdExists],
    // },
    async (request, response) => {
      // const { sessionId } = request.cookies

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        inDiet: z.boolean(),
        when: z.coerce.date(),
      })

      const { name, description, inDiet, when } = createMealBodySchema.parse(
        request.body,
      )

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      await knex('meals')
        .where({
          id,
          // , session_id: sessionId
        })
        .update({
          name,
          description,
          in_diet: inDiet,
          when: new Date(when).toISOString(),
          // user_id: userId,
        })

      response.status(204)
    },
  )

  // app.get(
  //   '/summary',
  //   {
  //     preHandler: [checkSessionIdExists],
  //   },
  //   async (request) => {
  //     const { sessionId } = request.cookies

  //     const summary = await knex('meals')
  //       .where('session_id', sessionId)
  //       .sum('amount', {
  //         as: 'amount',
  //       })
  //       .first()

  //     return { summary }
  //   },
  // )

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
      when: z.coerce.date(),
    })

    const { name, description, inDiet, when } = createMealBodySchema.parse(
      request.body,
    )

    const userId = 'a'

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      in_diet: inDiet,
      when: new Date(when).toISOString(),
      user_id: userId,
    })

    reply.status(201).send()
  })
}
