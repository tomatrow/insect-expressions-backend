/*
when Shopify.order.create
    ensure valid key
    // will fail if they are not subscribed, that's okay
    assign MailerLiteUser.customFields.last_order_timestamp to the time of this order in UTC
*/
import { parseISO } from "date-fns"
import MailerLite, { findField, LAST_ORDER_TIME_FIELD } from "../../controllers/MailerLite.js"

export const path = "/shopify-order-create"
export const method = "post"
export async function callback(ctx, next) {
    // verify request
    // see https://medium.com/@scottdixon/verifying-shopify-webhooks-with-nodejs-express-ac7845c9e40a
    ctx.verify(process.env.SHOPIFY_WEBHOOK_SIGNATURE, ctx.header["X-Shopify-Hmac-Sha256"])

    // some validation
    const { email, created_at } = ctx.getValidBodyJSON()
    ctx.assert(email && created_at, 422, "Expected body.email and body.created_at")
    // see https://shopify.dev/docs/admin-api/rest/reference/events/webhook for the expected body
    ctx.assert(email && created_at, "Expected email and created_at")

    // sending off the data
    const lastOrderTime = parseISO(created_at).toJSON()
    const response = await MailerLite.put(`/subscribers/${email}`, {
        fields: {
            [LAST_ORDER_TIME_FIELD]: lastOrderTime
        }
    })
    ctx.assert(
        findField(response.data, LAST_ORDER_TIME_FIELD) === lastOrderTime,
        "last_order_time field not updated"
    )

    console.log(`Updated ${email} field ${LAST_ORDER_TIME_FIELD} to ${lastOrderTime}`)
    ctx.status = 200

    await next()
}
