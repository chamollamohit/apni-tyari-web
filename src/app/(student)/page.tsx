import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    CheckCircle2,
    Trophy,
    Target,
    Users,
    Video,
    BookOpen,
} from "lucide-react";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function LandingPage() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 1. HERO SECTION */}
            <section className="relative py-20 lg:py-25 px-6 border-b border-slate-100 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent opacity-70"></div>

                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-black"></span>
                        India&apos;s Most Trusted Learning Platform
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className="relative h-32 w-45 md:h-40 md:w-80 animate-fade-in-up drop-shadow-xl">
                            <Image
                                src="/apni-tyari.png"
                                alt="Apni Tyari Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Crack JEE, NEET, and UPSC with structured courses
                        designed by India&apos;s top educators. Premium
                        education is now your right, not a privilege.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/search">
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg bg-black text-white hover:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all"
                            >
                                Explore Courses
                            </Button>
                        </Link>
                        {user ? (
                            <Link href="/dashboard">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-8 text-lg border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full"
                                >
                                    Go to Dashboard{" "}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-8 text-lg border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full"
                                >
                                    Start for Free
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Social Proof Text */}
                    <p className="text-sm text-slate-400 pt-4">
                        Trusted by{" "}
                        <span className="font-bold text-slate-900">
                            10,000+ Students
                        </span>{" "}
                        across India
                    </p>
                </div>
            </section>

            {/* 2. EXAM CATEGORIES */}
            <section className="py-15 px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Choose Your Goal
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Structured batches for every aspirant.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: JEE */}
                        <Link
                            href="/search?categoryId=JEE"
                            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 hover:shadow-xl hover:border-slate-300 transition-all"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <Target className="h-32 w-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="h-12 w-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-4">
                                    <Target className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    IIT JEE
                                </h3>
                                <p className="text-slate-500 mt-2">
                                    Mains & Advanced
                                </p>
                                <div className="mt-6 flex items-center text-sm font-semibold text-blue-700">
                                    View Batches{" "}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                </div>
                            </div>
                        </Link>

                        {/* Card 2: NEET */}
                        <Link
                            href="/search?categoryId=NEET"
                            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 hover:shadow-xl hover:border-slate-300 transition-all"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <Trophy className="h-32 w-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="h-12 w-12 bg-green-50 text-green-700 rounded-xl flex items-center justify-center mb-4">
                                    <Trophy className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    NEET UG
                                </h3>
                                <p className="text-slate-500 mt-2">
                                    Class 11, 12 & Dropper
                                </p>
                                <div className="mt-6 flex items-center text-sm font-semibold text-green-700">
                                    View Batches{" "}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                </div>
                            </div>
                        </Link>

                        {/* Card 3: Foundation */}
                        <Link
                            href="/search?categoryId=FOUNDATION"
                            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 hover:shadow-xl hover:border-slate-300 transition-all"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <BookOpen className="h-32 w-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="h-12 w-12 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center mb-4">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    Foundation
                                </h3>
                                <p className="text-slate-500 mt-2">
                                    Class 9th & 10th Boards
                                </p>
                                <div className="mt-6 flex items-center text-sm font-semibold text-purple-700">
                                    View Batches{" "}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. (Why Apni Tyari?) */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                            Why students choose <br /> Apni Tyari?
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="shrink-0 mt-1">
                                    <CheckCircle2 className="h-6 w-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Structured Schedule
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        Every batch follows a strict academic
                                        calendar. No missed topics.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 mt-1">
                                    <CheckCircle2 className="h-6 w-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Star Faculty
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        Learn from teachers who have mentored
                                        AIR 1 rankers.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 mt-1">
                                    <CheckCircle2 className="h-6 w-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Unlimited Replays
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        Missed a live class? Watch the recording
                                        as many times as you want.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Element */}
                    <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <Users className="h-8 w-8 text-blue-600 mb-2" />
                                <div className="text-2xl font-bold text-slate-900">
                                    50+
                                </div>
                                <div className="text-xs text-slate-500 font-bold uppercase">
                                    Expert Teachers
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <Video className="h-8 w-8 text-red-600 mb-2" />
                                <div className="text-2xl font-bold text-slate-900">
                                    1000+
                                </div>
                                <div className="text-xs text-slate-500 font-bold uppercase">
                                    Hours Content
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm col-span-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-bold text-slate-500 uppercase">
                                        Live Now
                                    </span>
                                </div>
                                <div className="text-lg font-bold text-slate-900">
                                    Physics: Rotational Motion
                                </div>
                                <div className="text-sm text-slate-500">
                                    Mohit Sir • Board Booster Batch
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
