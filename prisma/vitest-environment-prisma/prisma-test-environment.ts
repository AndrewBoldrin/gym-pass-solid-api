import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  async setup() {
    // codigo que vai executar antes dos test (antes de cada arquivo de test)
    console.log('Setup')

    return {
      // metodo a ser executado apos cada arquivo de test ser executado
      async teardown() {
        console.log('Teardown')
      },
    }
  },
}
