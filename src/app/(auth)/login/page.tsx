"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const LoginContent = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/auth-callback";

    const onLogin = () => {
        signIn("google", { callbackUrl });
    };

    return (
        <div className="w-full max-w-[350px] space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details to access your account
                </p>
            </div>

            <div className="grid gap-4">
                <Button
                    onClick={onLogin}
                    variant="outline"
                    className="w-full py-5 border-slate-300 hover:bg-slate-50 relative"
                >
                    <svg
                        className="mr-2 h-4 w-4 absolute left-4"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                        New to Apni Tyari?
                    </span>
                </div>
            </div>

            <Link href="/register">
                <Button variant="ghost" className="w-full">
                    Create an account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>

            <p className="px-8 text-center text-xs text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    );
};

export default function LoginPage() {
    return (
        <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                <div className="flex items-center gap-2 z-10">
                    <div className="hidden md:block relative h-15 w-50">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                <div className="z-10 max-w-lg">
                    <div className="mb-6">
                        <GraduationCap className="h-10 w-10 text-zinc-400 mb-4" />
                        <h1 className="text-3xl font-bold leading-tight mb-4">
                            Start your journey to academic excellence.
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            &quot;This platform helped me crack JEE Advanced
                            with a top rank. The structured curriculum is a game
                            changer.&quot;
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-xs">
                            AK
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Aryan Kumar</p>
                            <p className="text-xs text-zinc-500">
                                IIT Bombay, Batch of &apos;24
                            </p>
                        </div>
                    </div>
                </div>
                <div className="z-10 text-xs text-zinc-600 flex justify-between">
                    <p>© 2025 EdPlatform Inc.</p>
                    <p>Privacy Policy</p>
                </div>
            </div>

            <div className="flex items-center justify-center bg-white p-8">
                <Suspense
                    fallback={
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                            <p className="text-sm text-slate-500">
                                Loading secure login...
                            </p>
                        </div>
                    }
                >
                    <LoginContent />
                </Suspense>
            </div>
        </div>
    );
}
