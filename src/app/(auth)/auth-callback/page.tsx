"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";

const AuthCallbackContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    const returnTo = searchParams.get("callbackUrl");

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated" && session) {
            // 1. If specific return URL exists
            if (returnTo && returnTo !== "/auth-callback") {
                router.push(returnTo);
                return;
            }

            // 2. Default Redirects based on Role
            if (session.user.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/"); //
            }
        }
    }, [session, status, router, returnTo]);

    return (
        <div className="flex flex-col items-center gap-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-slate-600" />
            <p className="text-sm text-slate-500">Redirecting you...</p>
        </div>
    );
};

export default function AuthCallbackPage() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <Suspense
                fallback={<div className="animate-pulse">Loading...</div>}
            >
                <AuthCallbackContent />
            </Suspense>
        </div>
    );
}
