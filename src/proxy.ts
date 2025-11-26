import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // This function only runs if the user is logged in (because of the callbacks below)
        const token = req.nextauth.token;
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

        // 1. SECURITY: If trying to access /admin, strictly check role
        if (isAdminRoute && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // 2. Allow everything else
        return NextResponse.next();
    },
    {
        callbacks: {
            // "authorized" determines if the middleware function above should run.
            // If we return true, the middleware function runs.
            // If we return false, NextAuth forces a redirect to login.

            authorized: ({ req, token }) => {
                const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

                // If trying to access Admin Panel, MUST have a token (be logged in)
                if (isAdminRoute) {
                    return !!token;
                }

                // For all other routes (Main website, courses, etc.), allow access even without token
                return true;
            },
        },
    }
);

// Only run middleware on admin routes to save performance,
// OR run on all if you plan to add protected student routes (like /dashboard) later.
export const config = {
    matcher: [
        "/admin/:path*",
        "/((?!.+\\.[\\w]+$|_next).*)",
        "/",
        "/(api|trpc)(.*)",
    ],
};
