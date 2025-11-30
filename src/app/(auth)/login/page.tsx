"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    // If they came from a "Buy" button, this will hold that URL
    const callbackUrl = searchParams.get("callbackUrl") || "/auth-callback";

    const onLogin = () => {
        signIn("google", { callbackUrl });
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-sm border text-center">
                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-500 mb-6 text-sm">
                    Login to continue your learning journey
                </p>

                <button
                    onClick={onLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                    {/* Simple G Icon */}
                    <span className="font-bold text-blue-600">G</span>
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
