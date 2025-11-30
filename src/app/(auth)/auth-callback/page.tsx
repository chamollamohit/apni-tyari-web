"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    // Check if there was a specific return URL
    const returnTo = searchParams.get("callbackUrl");

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated" && session) {
            // 1. If there is a specific return URL (like checkout), go there first
            if (returnTo && returnTo !== "/auth-callback") {
                router.push(returnTo);
                return;
            }
            // If we are here it means user is logged in and comming from homepage only
            // 2. ADMIN FLOW: Auto-redirect to Dashboard
            if (session.user.role === "ADMIN") {
                router.push("/admin/dashboard");
            }
            // 3. STUDENT FLOW: Go to Homepage
            else {
                router.push("/");
            }
        }
    }, [session, status, router, returnTo]);

    return (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                <p className="text-sm text-slate-500">Redirecting you...</p>
            </div>
        </div>
    );
}
