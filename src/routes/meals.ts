import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import {
  FastifyRequestAuth,
  checkUserIdExists,
} from '../middlewares/check-user-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request) => {
      const { user } = request as FastifyRequestAuth

      const meals = await knex('meals').where('user_id', user.id).select()

      return {
        meals,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request) => {
      const { user } = request as FastifyRequestAuth

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({
          id,
          user_id: user.id,
        })
        .first()

      return {
        meal,
      }
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, response) => {
      const { user } = request as FastifyRequestAuth

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      await knex('meals')
        .where({
          id,
          user_id: user.id,
        })
        .delete()

      response.status(204)
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, response) => {
      const { user } = request as FastifyRequestAuth

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

      const meals = await knex('meals')
        .where({
          id,
          user_id: user.id,
        })
        .update({
          name,
          description,
          in_diet: inDiet,
          when: new Date(when).toISOString(),
        })
        .returning('*')

      response.status(202).send({
        meal: meals[0],
      })
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { user } = request as FastifyRequestAuth

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        inDiet: z.boolean(),
        when: z.coerce.date(),
      })

      const { name, description, inDiet, when } = createMealBodySchema.parse(
        request.body,
      )

      const meal = await knex('meals')
        .insert({
          id: randomUUID(),
          name,
          description,
          in_diet: inDiet,
          when: new Date(when).toISOString(),
          user_id: user.id,
        })
        .returning('*')

      reply.status(201).send({
        meal,
      })
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkUserIdExists],
    },
    async (request) => {
      const { user } = request as FastifyRequestAuth

      const counters = await knex('meals')
        .count('*', {
          as: 'total',
        })
        .sum('in_diet', {
          as: 'inDiet',
        })
        .where({
          user_id: user.id,
        })
        .first()

      return {
        summary: {
          inDiet: counters?.inDiet,
          notDiet: Number(counters?.total) - counters?.inDiet,
          total: counters?.total,
        },
      }
    },
  )
}
