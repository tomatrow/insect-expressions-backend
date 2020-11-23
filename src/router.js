import Router from "@koa/router"

import * as AddSubscription from "./routes/subscription/add.js"
import * as MergeSubscription from "./routes/subscription/merge.js"

const router = new Router({ prefix: `/.netlify/functions/${process.env.SERVER_PATH}` })

function add(path, routes, parent = router) {
    const child = new Router()

    for (let route of routes) {
        // check route is well defined
        for (let key of ["path", "method", "callback"])
            if (route[key] === undefined)
                throw new Error(`Undefined route: ${route.path} ${route.method} at ${key}`)
        // add it
        child[route.method](route.path, route.callback)
    }

    parent.use(path, child.routes(), child.allowedMethods())
}

add("/subscription", [AddSubscription, MergeSubscription])

export default router
