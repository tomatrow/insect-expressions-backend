import axios from "axios"

export const findField = (subscriber, name) =>
    subscriber.fields.find(field => field.key === name).value

export const LAST_ORDER_TIME_FIELD = "last_order_time"
export const SIGN_UP_SOURCE_FIELD = "sign_up_source"
export const IS_READY_FOR_REMINDER_EMAIL_FIELD = "is_ready_for_reminder_email"
export const INSECT_EXPRESSION_GROUP_ID = 104428943

// converts from `Y-m-d H:i:s` in PHP.date format
// see https://www.php.net/manual/en/datetime.format.php
export const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss"

export default axios.create({
    baseURL: "https://api.mailerlite.com/api/v2",
    headers: {
        "X-MailerLite-ApiKey": process.env.MAILER_LITE_KEY,
        "Content-Type": "application/json"
    }
})
