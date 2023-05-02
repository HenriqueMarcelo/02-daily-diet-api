npm i -D typescript
npx tsc --init
npx tsx src/index.ts

npm run migrate-create create-documents
npm run knex -- migrate:latest
npm run knex -- migrate:rollback
