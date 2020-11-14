import json from "@rollup/plugin-json"
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: "src/index.js",
    output: {
        file: "functions/server/app.js",
        format: "cjs",
        exports: "auto"
    },
    external: ["@koa/cors", "@koa/router", "koa"],
    plugins: [resolve(), commonjs(), json()]
}
