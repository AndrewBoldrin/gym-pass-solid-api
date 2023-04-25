import { env } from './env'
import { app } from './app'

app
  .listen({
    host: '0.0.0.0', // para não ter problemas com a conexao com o front-end
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
