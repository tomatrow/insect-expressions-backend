import MailerLite from "../../controllers/MailerLite.js"
import Shopify from "../../controllers/Shopify.js"
import { format } from "date-fns"

export const path = "/merge"

export const method = "post"

export async function callback(ctx, next) {
    await next()

    const subscribersResponse = await mailerLite.get("/subscribers")
    const subscribers = subscribersResponse.data

    for (let subscriber of subscribers) {
        const getField = name => subscriber.fields.find(field => field.key === name).value
        const { email } = subscriber

        try {
            // get the user data from shopify
            const shopifyId = getField("shopify_id")
            if (!shopifyId) continue

            // find the last order
            const user = await Shopify.customer.get(shopifyId)
            if (!user.last_order_id) {
                console.log(`${email} no order`)
                continue
            }
            const { last_order_id } = user

            // find when the last order happened
            const lastOrder = await Shopify.order.get(last_order_id)
            const {
                // https://community.shopify.com/c/Shopify-APIs-SDKs/Is-it-expected-that-processed-at-can-be-larger-than-created-at/m-p/596219/highlight/true#M40287
                // this is <= created_at + c where c <= a few seconds
                processed_at
            } = lastOrder
            if (!processed_at) continue

            // add the last order time to mailerlite
            const lastOrderDate = new Date(processed_at)
            await MailerLite.put(`/subscribers/${email}`, {
                fields: {
                    // 2020-09-30 00:15:58
                    last_order_time: format(lastOrderDate, "yyyy-LL-dd HH:mm:ss")
                }
            })

            console.log(`${email} proccessed`)
        } catch (error) {
            console.error(`${email} failed`, error)
        }
    }

    ctx.status = 200
}
