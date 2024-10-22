import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
    publicRoutes: [
        "/",
        "/sign-in",
        "/sign-up",
        "/api/webhooks/clerk",
    ],
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}