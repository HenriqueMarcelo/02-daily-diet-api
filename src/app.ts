import fastify from 'fastify'

import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

// Testes:
// Unitários: unidade da sua aplicação
// Integração: comunicação entre duas ou mais unidades
// end 2 end - Ponta a ponta: simulam um usuário operando a nossa aplicação

// front-end: abre a página de login, digite o texto teste@teste.com no campo email, clica no botão...
// back-end: chamadas HTTP, websockets

// Pirâmide de testes: E2E (não dependem de nenhuma tecnologia, não dependem de arquitetura)

export const app = fastify()

// app.addHook('preHandler', async (request, reply) => {
//   console.log(`[${request.method}] ${request.url}`)
// })

app.register(fastifyCookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
