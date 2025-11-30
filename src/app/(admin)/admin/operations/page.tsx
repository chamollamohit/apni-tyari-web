import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { Lesson, Chapter, Teacher } from "@prisma/client";
import { BatchSelector } from "@/components/admin-components/operation-components/batch-selector";
import { OperationsView } from "@/components/admin-components/operation-components/operations-view";
import { addDays, endOfDay, startOfDay } from "date-fns";

interface OperationsPageProps {
    searchParams: Promise<{
        courseId?: string;
        subjectId?: string;
        from?: string;
        to?: string;
    }>;
}

type ScheduleData = (Lesson & {
    chapter: Chapter;
    teacher: Teacher | null;
})[];
export default async function OperationsPage({
    searchParams,
}: OperationsPageProps) {
    const session = await getServerSession(authOptions);

    const { courseId, subjectId, from, to } = await searchParams;

    if (session?.user?.role !== "ADMIN") {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            subjects: {
                orderBy: { position: "asc" },
            },
        },
    });

    let scheduleData: ScheduleData = [];
    let availableChapters: Chapter[] = [];
    let availableTeachers: Teacher[] = [];

    if (subjectId && courseId) {
        const startDate = from
            ? startOfDay(new Date(from))
            : startOfDay(new Date());

        const endDate = to
            ? endOfDay(new Date(to))
            : endOfDay(addDays(new Date(), 6));

        // Fetch Schedule
        scheduleData = await db.lesson.findMany({
            where: {
                chapter: {
                    subjectId: subjectId,
                },
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                chapter: true,
                teacher: true,
            },
            orderBy: {
                date: "asc",
            },
        });

        // Fetch Chapters
        availableChapters = await db.chapter.findMany({
            where: {
                subjectId: subjectId,
            },
            orderBy: { position: "asc" },
        });

        // Fetch Teachers
        availableTeachers = await db.teacher.findMany({
            where: {
                subjects: {
                    some: {
                        id: subjectId,
                    },
                },
            },
        });
    }
    return (
        <div className="p-6">
            <div className="flex flex-col gap-y-2 mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    Batch Operations
                </h1>
                <p className="text-sm text-slate-500">
                    Manage schedules, upload daily content, and handle lesson
                    updates.
                </p>
            </div>
            <BatchSelector courses={courses} />

            {!subjectId || !courseId ? (
                <div className="border border-dashed border-slate-300 rounded-lg h-[400px] flex items-center justify-center text-slate-500 bg-slate-50">
                    <div className="text-center">
                        <p className="text-sm mt-1">
                            Please select a Batch and Subject above.
                        </p>
                    </div>
                </div>
            ) : (
                <OperationsView
                    courseId={courseId}
                    subjectId={subjectId}
                    scheduleData={scheduleData}
                    chapters={availableChapters}
                    teachers={availableTeachers}
                />
            )}
        </div>
    );
}
