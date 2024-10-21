import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
    publicRoutes: [
        "/",
        "/sign-in",
        "/sign-up",
        "/api/webhooks/clerk",
    ],
    afterAuth(auth: any, req: any) {
        if (!auth.userId && !auth.isPublicRoute) {
            return Response.redirect(new URL("/sign-in", req.url));
        }
    },
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}