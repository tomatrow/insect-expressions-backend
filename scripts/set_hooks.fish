#! /usr/local/bin/fish

# set data "{ \"url\": \"https://$PROJECT_NAME.netlify.app/.netlify/functions/$SERVER_PATH/webhooks/mailerlite-subscriber-add-to-group\", \"event\": \"subscriber.add_to_group\" }" \
set data "{ \"url\": \"https://9334424323ec.ngrok.io/.netlify/functions/$SERVER_PATH/webhooks/mailerlite-subscriber-add-to-group\", \"event\": \"subscriber.add_to_group\" }" \

curl -X POST 'https://api.mailerlite.com/api/v2/webhooks' \
    -d "$data" \
    -H 'Content-Type: application/json' \
    -H "X-MailerLite-ApiKey: $MAILER_LITE_KEY"