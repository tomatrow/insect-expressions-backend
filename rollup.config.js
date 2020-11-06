import json from "@rollup/plugin-json"

export default {
    input: "src/index.js",
    output: {
        file: "functions/server/app.js",
        format: "cjs",
        exports: "auto"
    },
    external: ["@koa/cors", "@koa/router", "koa"],
    plugins: [json()]
}
