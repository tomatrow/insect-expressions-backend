import Koa from "koa"
import cors from "@koa/cors"
import bodyParser from "koa-bodyparser"

import router from "./router.js"
import main from "./main.js"
import utility from "./utility.js"

const app = new Koa()

Object.assign(app.context, utility)

app.use(cors()) // TODO: Restrict to Shopify, Mailerlite, and Insect Expressions origins
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
app.use(main)

export default app
