import fastify from 'fastify'

import { transactionsRoutes } from './routes/transactions'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.register(usersRoutes, {
  prefix: 'users',
})
