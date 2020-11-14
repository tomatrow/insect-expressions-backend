import axios from "axios"

export default axios.create({
    baseURL: "https://api.mailerlite.com/api/v2",
    headers: {
        "X-MailerLite-ApiKey": process.env.MAILER_LITE_KEY,
        "Content-Type": "application/json"
    }
})
