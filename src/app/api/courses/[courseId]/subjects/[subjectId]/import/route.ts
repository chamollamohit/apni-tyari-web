import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

type ImportRow = {
    Chapter: string;
    Title: string;
    Date: string;
    TeacherEmail: string;
};

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string; subjectId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { subjectId } = await params;
        const body = await req.json();
        const rows: ImportRow[] = body.data;

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!rows || rows.length === 0) {
            return NextResponse.json(
                { message: "No data provided" },
                { status: 400 }
            );
        }

        // 1. PRE-FETCH DATA of the Teacher Availble in the Subject
        const subjectTeachers = await db.teacher.findMany({
            where: {
                subjects: {
                    some: {
                        id: subjectId,
                    },
                },
            },
        });

        const teacherObj: Record<string, string> = subjectTeachers.reduce(
            (acc, teacher) => {
                acc[teacher.email] = teacher.id;
                return acc;
            },
            {} as Record<string, string>
        );

        // Validate all teachers exist BEFORE starting transaction
        const invalidEmails = new Set<string>();
        rows.forEach((row) => {
            if (!teacherObj[row.TeacherEmail])
                invalidEmails.add(row.TeacherEmail);
        });

        if (invalidEmails.size > 0) {
            return NextResponse.json(
                {
                    message: `Teachers not found in the Subject: ${Array.from(
                        invalidEmails
                    ).join(", ")} `,
                },
                { status: 400 }
            );
        }

        const existingChapters = await db.chapter.findMany({
            where: { subjectId },
            orderBy: { position: "asc" },
        });

        const chapterObj: Record<string, string> = existingChapters.reduce(
            (acc, chapter) => {
                acc[chapter.title] = chapter.id;
                return acc;
            },
            {} as Record<string, string>
        );

        let nextChapterPosition =
            existingChapters.length > 0
                ? existingChapters[existingChapters.length - 1].position + 1
                : 1;

        // if anything fails it will fallback to original
        await db.$transaction(
            async (tx) => {
                for (const row of rows) {
                    // A. Handle Chapter (Create if missing)
                    let chapterId = chapterObj[row.Chapter];

                    if (!chapterId) {
                        const newChapter = await tx.chapter.create({
                            data: {
                                title: row.Chapter,
                                subjectId: subjectId,
                                position: nextChapterPosition++,
                                isPublished: true,
                            },
                        });
                        chapterId = newChapter.id;
                        chapterObj[row.Chapter] = newChapter.id;
                    }

                    // B. Create Lesson

                    const lessonCount = await tx.lesson.count({
                        where: { chapterId },
                    });

                    await tx.lesson.create({
                        data: {
                            title: row.Title,
                            chapterId: chapterId,
                            position: lessonCount + 1,
                            isPublished: true,
                            isFree: false,
                            teacherId: teacherObj[row.TeacherEmail],
                            date: new Date(row.Date),
                        },
                    });
                }
            },
            {
                maxWait: 5000,
                timeout: 10000,
            }
        );

        return NextResponse.json({
            success: true,
            message: `Successfully scheduled ${rows.length} lessons.`,
        });
    } catch (error) {
        console.log("[IMPORT_TRANSACTION_ERROR]", error);
        return NextResponse.json(
            { message: "Unable to create the schedule." },
            { status: 500 }
        );
    }
}
