import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { FileText, ChevronLeft, Lock, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { format, isFuture } from "date-fns";

import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/user-components/course-components/video-player";
import { LessonCompleteButton } from "@/components/user-components/dashboard-components/lesson-complete-button";

export default async function LessonIdPage({
    params,
}: {
    params: Promise<{ courseId: string; lessonId: string }>;
}) {
    const { courseId, lessonId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return redirect("/");

    // 1. Fetch Current Lesson
    const lesson = await db.lesson.findUnique({
        where: {
            id: lessonId,
        },
        include: {
            chapter: true,
            userProgress: {
                where: { userId: session.user.id },
            },
        },
    });

    if (!lesson) return redirect(`/courses/${courseId}/learn`);

    // 2. Prevent accessing future lessons
    if (isFuture(new Date(lesson.date))) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
                <div className="p-6 bg-slate-100 rounded-full mb-2">
                    <Lock className="h-10 w-10 text-slate-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Class Not Started Yet
                </h1>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md w-full">
                    <p className="text-slate-500 mb-2 text-sm uppercase font-bold tracking-wide">
                        Scheduled For
                    </p>
                    <p className="text-lg font-semibold text-slate-900 flex items-center justify-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {format(new Date(lesson.date), "PPP")}
                    </p>
                    <p className="text-md text-slate-700 flex items-center justify-center gap-2 mt-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(lesson.date), "h:mm a")}
                    </p>
                </div>
                <Link
                    href={`/courses/${courseId}/learn/subject/${lesson.chapter.subjectId}`}
                >
                    <Button variant="outline" className="mt-4">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Schedule
                    </Button>
                </Link>
            </div>
        );
    }

    // 3. Fetching Next Lesson

    const nextLesson = await db.lesson.findFirst({
        where: {
            chapter: {
                subjectId: lesson.chapter.subjectId,
            },
            isPublished: true,
            date: {
                gt: lesson.date,
            },
        },
        orderBy: {
            date: "asc",
        },
    });

    const isCompleted = lesson.userProgress?.[0]?.isCompleted;

    return (
        <div className="flex flex-col max-w-5xl mx-auto pb-20">
            {/* 1. Header / Navigation */}
            <div className="px-6 pt-6 pb-4">
                <Link
                    href={`/courses/${courseId}/learn/subject/${lesson.chapter.subjectId}`}
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Schedule
                </Link>
            </div>

            {/* 2. Video Player */}
            <div className="px-4 md:px-6">
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-black shadow-lg">
                    <div className="relative aspect-video">
                        <VideoPlayer
                            url={lesson.videoUrl || ""}
                            title={lesson.title}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Lesson Info */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/*  Title & Notes */}
                <div className="lg:col-span-2 space-y-4">
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                        {lesson.title}
                    </h1>

                    <div className="flex items-center gap-x-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(lesson.date), "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {format(new Date(lesson.date), "h:mm a")}
                        </span>
                    </div>

                    {lesson.notesUrl && (
                        <div className="pt-4">
                            <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wide">
                                Resources
                            </h3>
                            <a
                                href={lesson.notesUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center w-full md:w-fit gap-x-3 p-3 text-sm text-slate-700 hover:text-blue-700 bg-white border border-slate-200 hover:border-blue-300 rounded-lg transition-all group"
                            >
                                <div className="p-2 bg-slate-100 group-hover:bg-blue-50 rounded-md text-slate-500 group-hover:text-blue-600 transition">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        Class Notes (PDF)
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        Click to view or download
                                    </span>
                                </div>
                            </a>
                        </div>
                    )}
                </div>

                {/* Lesson Complete Button */}
                <div className="lg:col-span-1 flex flex-col justify-start lg:items-end gap-4">
                    <LessonCompleteButton
                        courseId={courseId}
                        lessonId={lessonId}
                        isCompleted={!!isCompleted}
                        nextLessonId={nextLesson?.id}
                    />
                    {/* Next Session */}
                    {nextLesson && (
                        <div className="text-xs text-slate-400 text-right hidden lg:block">
                            Next: {nextLesson.title}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
