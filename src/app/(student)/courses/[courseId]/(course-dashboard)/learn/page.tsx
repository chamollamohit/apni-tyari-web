import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { getCourseContent } from "@/actions/get-course-content";
import { ArrowLeft, BookOpen, ChevronRight, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default async function CourseLearnPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const session = await getServerSession(authOptions);
    const { courseId } = await params;

    if (!session?.user?.id) return redirect("/");

    // 1. Fetch Course
    const course = await getCourseContent(courseId, session.user.id);

    if (!course) return redirect("/dashboard");

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
            <div>
                <Link
                    href={`/dashboard`}
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">
                    {course.title}
                </h1>
                <p className="text-slate-500 mt-2">
                    Select a subject to view its schedule and content.
                </p>
            </div>

            {course.subjects.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border border-dashed rounded-xl text-slate-500">
                    <Layers className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p>No subjects added to this course yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {course.subjects.map((subject) => {
                        const subjectLessons = subject.chapters.flatMap(
                            (chap) => chap.lessons
                        );
                        const totalLessons = subjectLessons.length;
                        const completedLessons = subjectLessons.filter(
                            (l) => l.userProgress?.[0]?.isCompleted
                        ).length;

                        const progress =
                            totalLessons === 0
                                ? 0
                                : (completedLessons / totalLessons) * 100;

                        return (
                            <Link
                                key={subject.id}
                                href={`/courses/${courseId}/learn/subject/${subject.id}`}
                                className="group block h-full"
                            >
                                <div className="h-full bg-white border border-slate-200 rounded-xl p-6 flex flex-col hover:border-slate-300 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-slate-50 rounded-lg text-slate-700 group-hover:bg-slate-100 transition">
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="bg-slate-50 text-slate-600 font-normal"
                                        >
                                            {totalLessons} Sessions
                                        </Badge>
                                    </div>

                                    <h3 className="font-bold text-xl text-slate-900 mb-2 ">
                                        {subject.title}
                                    </h3>

                                    <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">
                                        Includes {subject.chapters.length}{" "}
                                        chapters covering the complete syllabus.
                                    </p>

                                    {/* Progress Section */}
                                    <div className="mt-auto space-y-3">
                                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                                            <span>Progress</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <Progress
                                            value={progress}
                                            className="h-1.5"
                                        />

                                        <Button
                                            variant="outline"
                                            className="w-full mt-4 border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all"
                                        >
                                            View Schedule{" "}
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
