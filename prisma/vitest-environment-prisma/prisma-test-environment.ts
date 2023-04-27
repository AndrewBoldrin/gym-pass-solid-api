import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// postgresql://docker:docker@localhost:5432/apisolid?schema=public

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    // codigo que vai executar antes dos test (antes de cada arquivo de test)
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    // deploy - para ele só ler as migrations já criada e executar.
    // pois com a opção dev ele verifica o que mudou e executa so as migrations que foram modificadas
    execSync('npx prisma migrate deploy')

    return {
      // metodo a ser executado apos cada arquivo de test ser executado
      async teardown() {
        // executa operações que nao sao buscas
        // cascade apaga tudo atrelado ao schema, etc
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
