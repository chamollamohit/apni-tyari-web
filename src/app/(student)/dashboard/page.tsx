import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CourseCard } from "@/components/user-components/course-card";
import { CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CourseProgress } from "@/components/user-components/dashboard-components/course-progress";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) return redirect(`/login?callbackUrl=/dashboard`);

    const { completedCourses, coursesInProgress } = await getDashboardCourses(
        userId
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* 1. Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Dashboard
                    </h1>
                    <p className="text-sm text-slate-500">
                        Welcome back, {session.user?.name}
                    </p>
                </div>
            </div>

            {/* 2. Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-white shadow-sm flex items-center gap-x-4">
                    <div className="p-3 bg-slate-100 rounded-full text-slate-700">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">
                            {coursesInProgress.length}
                        </p>
                        <p className="text-xs text-slate-500 font-medium uppercase">
                            In Progress
                        </p>
                    </div>
                </div>
                <div className="p-4 border rounded-lg bg-white shadow-sm flex items-center gap-x-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-700">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">
                            {completedCourses.length}
                        </p>
                        <p className="text-xs text-slate-500 font-medium uppercase">
                            Completed
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Course List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">My Courses</h2>

                {coursesInProgress.length === 0 &&
                completedCourses.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-slate-50 border border-dashed rounded-lg">
                        <p>No courses found.</p>
                        <Link
                            href="/search"
                            className="text-slate-900 underline mt-2 inline-block"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...coursesInProgress, ...completedCourses].map(
                            (course) => (
                                <Link
                                    key={course.id}
                                    href={`/courses/${course.id}/learn`}
                                >
                                    <div className="group hover:shadow-md transition overflow-hidden border rounded-lg h-full flex flex-col bg-white">
                                        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-slate-100">
                                            {course.imageUrl && (
                                                <Image
                                                    fill
                                                    className="object-cover"
                                                    src={course.imageUrl}
                                                    alt={course.title}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col p-4 flex-1">
                                            <h3 className="font-bold text-slate-900 line-clamp-1  transition">
                                                {course.title}
                                            </h3>
                                            <div className="mt-4 w-full">
                                                <CourseProgress
                                                    value={course.progress || 0}
                                                    size="sm"
                                                    variant={
                                                        course.progress === 100
                                                            ? "success"
                                                            : "default"
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
