import Koa from "koa"
import cors from "@koa/cors"
import bodyParser from "koa-bodyparser"

import router from "./router.js"
import main from "./main.js"

const app = new Koa()

app.use(cors())
app.use(bodyParser())
app.use(async (ctx, next) => {
    console.log("Hello")
    await next()
})
app.use(router.routes())
app.use(router.allowedMethods())
app.use(main)

export default app
