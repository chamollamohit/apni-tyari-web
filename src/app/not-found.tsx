import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white text-center p-6">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
                <AlertCircle className="h-16 w-16 text-slate-300" />
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                Page Not Found
            </h1>

            <p className="text-lg text-slate-500 max-w-md mb-8">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
                It might have been removed or renamed.
            </p>

            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Go Back Home
                    </Button>
                </Link>
                <Link href="/search">
                    <Button className="bg-black text-white hover:bg-slate-800">
                        Browse Courses
                    </Button>
                </Link>
            </div>
        </div>
    );
}
