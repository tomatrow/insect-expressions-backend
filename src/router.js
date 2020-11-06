import Router from "@koa/router"

import * as AddSubscription from "./routes/AddSubscription.js"

const routes = [AddSubscription]

const router = new Router({ prefix: "/.netlify/functions/server" })

// add routes to router
for (let route of routes)
    if (route.path !== undefined && route.callback !== undefined)
        // add a collection route
        router.get(route.path, route.callback)
    else throw new Error("Undefined route")

export default router
