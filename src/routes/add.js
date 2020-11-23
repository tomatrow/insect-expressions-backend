import MailerLite from "../../controllers/MailerLite.js"

export const path = "/subscription/add"

export const method = "post"

export async function callback(ctx, next) {
    await next()

    // get the email out from the request
    ctx.assert(ctx.is("application/json"), 500, "Expected json body")
    const { email } = ctx.request.body
    ctx.assert(typeof email === "string", 500, `Expected body form of { "email": "<email>" }`)

    // send a response
    let response
    try {
        response = await MailerLite.post("/subscribers", { email })
        ctx.assert(response.status === 200, 500)
        ctx.status = 200
    } catch (error) {
        ctx.status = 500
    }
}
