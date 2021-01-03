import MailerLite, { SIGN_UP_SOURCE_FIELD, DATE_FORMAT } from "../../controllers/MailerLite.js"
import { parse, differenceInMinutes } from "date-fns"

export const path = "/add"

export const method = "post"

export async function callback(ctx, next) {
    // get the email out from the request
    const { email, source } = ctx.getValidBodyJSON()
    ctx.assert(typeof email === "string", 422, `Expected body.email`)
    ctx.assert(typeof source === "string", 422, `Expected body.source`)

    // add subscriber
    const response = await MailerLite.post("/subscribers", {
        email,
        fields: {
            [SIGN_UP_SOURCE_FIELD]: source
        }
    })
    ctx.assert(response.status === 200, 500, "Post to MailerLite's /subscribers was not OK")

    // check this subscriber is new
    // this date is in UTC, we're safe
    const creationDate = parse(response.data.date_created, DATE_FORMAT, new Date())
    const leeway = 30
    ctx.assert(
        differenceInMinutes(creationDate, Date.now()) < leeway,
        400,
        `The user signed up more than ${leeway} minutes ago`
    )

    ctx.status = 200
    await next()
}
