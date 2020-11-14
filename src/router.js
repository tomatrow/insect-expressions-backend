import Router from "@koa/router"

import * as AddSubscription from "./routes/subscription/add.js"

const routes = [AddSubscription]

const router = new Router({ prefix: "/.netlify/functions/server/subscription" })

// add routes to router
for (let route of routes)
    if (route.path !== undefined && route.callback !== undefined)
        // add a collection route
        router[route.method](route.path, route.callback)
    else throw new Error("Undefined route")

export default router
