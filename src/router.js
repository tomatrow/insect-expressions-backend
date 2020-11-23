import Router from "@koa/router"

import * as AddSubscription from "./routes/add.js"
import * as MergeSubscription from "./routes/merge.js"

const routes = [AddSubscription, MergeSubscription]

const router = new Router({ prefix: "/.netlify/functions/server" })

// add routes to router
for (let route of routes)
    if (['path', 'route', 'callback'].every(Object.hasOwnProperty))
        // add a collection route
        router[route.method](route.path, route.callback)
    else throw new Error("Undefined route")

export default router
