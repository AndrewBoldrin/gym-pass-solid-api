import { app } from "./app";

app.listen({
    host: '0.0.0.0', // para não ter problemas com a conexao com o front-end
    port: 3333
})
.then(() => {
    console.log('HTTP Server Running!')
})