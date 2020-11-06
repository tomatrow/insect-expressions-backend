export const path = '/add-subscription'

export async function callback(ctx, next) {
    await next()
    ctx.body = {
        message: "Hello"
    }
}