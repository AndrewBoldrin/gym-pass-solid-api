import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // 'src/http/controllers/**' - caminho da pasta em que queremos executar o ambiente de teste criado pelo vitest
    // 'prisma' - tem que ser o mesmo nome criado da pasta prisma/vitest-environment-prisma (nome depois do vitest-environmennt-{nome})
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
  },
})
