import Koa from "koa"
import cors from "@koa/cors"

import router from "./router.js"
import main from "./main.js"

export default new Koa().use(cors()).use(router.routes()).use(router.allowedMethods()).use(main)
