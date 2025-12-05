import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { format, isFuture, isToday } from "date-fns";
import {
    Lock,
    PlayCircle,
    CheckCircle2,
    ArrowLeft,
    LayoutList,
    Video,
    FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { formatIST } from "@/lib/format";

export default async function SubjectSchedulePage({
    params,
}: {
    params: Promise<{ courseId: string; subjectId: string }>;
}) {
    const session = await getServerSession(authOptions);
    const { courseId, subjectId } = await params;

    if (!session?.user?.id) return redirect("/");

    const subject = await db.subject.findUnique({
        where: { id: subjectId, courseId },
        include: {
            chapters: {
                where: { isPublished: true },
                orderBy: { position: "asc" },
                include: {
                    lessons: {
                        where: { isPublished: true },
                        orderBy: { date: "asc" },
                        include: {
                            userProgress: {
                                where: { userId: session.user.id },
                            },
                            teacher: true,
                        },
                    },
                },
            },
        },
    });

    if (!subject) return redirect(`/courses/${courseId}/learn`);

    // Calculate total stats for the header
    const allLessons = subject.chapters.flatMap((c) => c.lessons);
    console.log(allLessons);

    const completedCount = allLessons.filter(
        (l) => l.userProgress?.[0]?.isCompleted
    ).length;

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            {/* Header */}
            <div className="mb-8 border-b border-slate-200 pb-6">
                <Link
                    href={`/courses/${courseId}/learn`}
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Course
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {subject.title}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {completedCount} / {allLessons.length} Lessons
                            Completed
                        </p>
                    </div>
                </div>
            </div>

            {/* Chapter Accordion  */}
            <div className="space-y-4">
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                    defaultValue={subject.chapters[0]?.id}
                >
                    {subject.chapters.map((chapter) => (
                        <AccordionItem
                            key={chapter.id}
                            value={chapter.id}
                            className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm"
                        >
                            {/* Chapter Header */}
                            <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 hover:no-underline">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="p-2 bg-slate-100 rounded-md text-slate-700">
                                        <LayoutList className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            {chapter.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                                            {chapter.lessons.length} Lessons
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>

                            {/* Lesson Rows */}
                            <AccordionContent className="border-t border-slate-100 bg-slate-50/50 p-0">
                                {chapter.lessons.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400 text-sm italic">
                                        No lessons scheduled yet.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {chapter.lessons.map((lesson) => {
                                            const lessonDate = new Date(
                                                lesson.date
                                            );
                                            const isLocked =
                                                isFuture(lessonDate);
                                            const isCompleted =
                                                lesson.userProgress?.[0]
                                                    ?.isCompleted;
                                            const isLiveToday =
                                                isToday(lessonDate);

                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 transition-colors",
                                                        isLocked
                                                            ? "opacity-60 bg-slate-50"
                                                            : "hover:bg-white"
                                                    )}
                                                >
                                                    {/* Status Icon */}
                                                    <div className="flex-shrink-0">
                                                        {isLocked ? (
                                                            <Lock className="h-5 w-5 text-slate-400" />
                                                        ) : isCompleted ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                        ) : (
                                                            <PlayCircle
                                                                className={cn(
                                                                    "h-5 w-5",
                                                                    isLiveToday
                                                                        ? "text-red-600 animate-pulse"
                                                                        : "text-slate-900"
                                                                )}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4
                                                                className={cn(
                                                                    "font-medium truncate",
                                                                    isCompleted
                                                                        ? "text-slate-500"
                                                                        : "text-slate-900"
                                                                )}
                                                            >
                                                                {lesson.title}
                                                            </h4>
                                                            {isLiveToday && (
                                                                <Badge className="bg-red-600 text-[10px] px-1.5 h-4">
                                                                    Today&apos;s
                                                                    Session
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                                            <span>
                                                                {formatIST(
                                                                    lesson.date
                                                                )}
                                                            </span>
                                                            {lesson.teacher && (
                                                                <>
                                                                    <span>
                                                                        •
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            lesson
                                                                                .teacher
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Content Indicators (Video/Notes) */}
                                                    <div className="hidden sm:flex items-center gap-3 text-slate-400">
                                                        {lesson.videoUrl && (
                                                            <div
                                                                title="Video Available"
                                                                className={cn(
                                                                    isLocked
                                                                        ? ""
                                                                        : "text-slate-700"
                                                                )}
                                                            >
                                                                <Video className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                        {lesson.notesUrl && (
                                                            <div
                                                                title="Notes Available"
                                                                className={cn(
                                                                    isLocked
                                                                        ? ""
                                                                        : "text-slate-700"
                                                                )}
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action */}
                                                    <div className="flex-shrink-0">
                                                        {isLocked ? (
                                                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                                {format(
                                                                    lessonDate,
                                                                    "MMM d"
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <Link
                                                                href={`/courses/${courseId}/learn/lessons/${lesson.id}`}
                                                            >
                                                                <Badge
                                                                    variant="outline"
                                                                    className="hover:bg-black hover:text-white cursor-pointer border-slate-300"
                                                                >
                                                                    Start
                                                                </Badge>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
