/*
when MailerLite.subscriber.add_to_group
    ensure valid key
    if group is "Awaiting Reminder Email"
        // it's been 48 hours since they signed up via popup/landing 
        if MailerLiteUser.customFields.last_order_timestamp >= 48 hours ago in UTC or blank 
            send reminder email
        remove from group 
*/
import MailerLite, {
    findField,
    IS_READY_FOR_REMINDER_EMAIL_FIELD,
    LAST_ORDER_TIME_FIELD
} from "../../controllers/MailerLite.js"

const ADD_TO_GROUP_EVENT_ID = "subscriber.add_to_group"
const AWAITING_REMINDER_EMAIL_GROUP_ID = 105154454

export const path = "/mailerlite-subscriber-add-to-group"

export const method = "post"

export async function callback(ctx, next) {
    ctx.verify(process.env.MAILER_LITE_KEY, ctx.headers["X-MailerLite-Signature"])
    ctx.log(ctx.header)

    // some body validation
    const { events } = ctx.getValidBodyJSON()
    ctx.assert(Array.isArray(events) && events.length > 0, 422, "Expected non empty event list")

    // subscribers added to the Awaiting Reminder Group
    const subscribers = events
        .filter(
            event =>
                event.type === ADD_TO_GROUP_EVENT_ID &&
                event.data.group.id === AWAITING_REMINDER_EMAIL_GROUP_ID
        )
        .map(event => event.data.subscriber)

    const NOW = new Date()

    // mark any subscribers that did not recently order something for reminding
    const updateRequests = subscribers
        .filter(subscriber => {
            const lastOrderTimestamp = findField(subscriber, LAST_ORDER_TIME_FIELD)

            // mark for reminder if there were no orders at all or in the last 48 hours
            // (with leeway since timing stuff is inexact)
            const leeway = 5
            return (
                !lastOrderTimestamp ||
                differenceInMinutes(new Date(lastOrderTimestamp), NOW) > 2 * 24 * 60 - leeway
            )
        })
        .map(subscriber => ({
            method: "PUT",
            path: `/api/v2/subscribers/${subscriber.email}`,
            body: {
                fields: {
                    [IS_READY_FOR_REMINDER_EMAIL_FIELD]: "true"
                }
            }
        }))

    // clear all processed subscribers from this group
    const removeRequests = subscribers.map(subscriber => ({
        method: "DELETE",
        path: `/api/v2/groups/${AWAITING_REMINDER_EMAIL_GROUP_ID}/subscribers/${subscriber.email}`
    }))

    // batch requests
    const batchResponse = await MailerLite.post("/batch", {
        requests: [...removeRequests, ...updateRequests]
    })

    ctx.log(batchResponse)

    ctx.status = 200
    await next()
}

/*
How do I trigger an event?
    I guess I just add anyone to a group.
    I'll also need to ensure the hook is set to my ngrok instance
    e.g. 
    curl -X POST https://6c8ae30824e2.ngrok.io/.netlify/functions/server/webhooks/mailerlite-subscriber-add-to-group
*/
