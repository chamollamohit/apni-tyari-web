import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Validation
        const { title, chapterId, teacherId, date } = await req.json();

        if (!title || !chapterId || !teacherId || !date) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Getting Last Lesson Position
        const lastLesson = await db.lesson.findFirst({
            where: { chapterId },
            orderBy: { position: "desc" },
        });

        const newPosition = lastLesson ? lastLesson.position + 1 : 1;

        // Adding Lesson entry in DB
        const lesson = await db.lesson.create({
            data: {
                title,
                chapterId,
                teacherId,
                date: new Date(date),
                position: newPosition,
                isPublished: true,
                isFree: false,
            },
        });

        return NextResponse.json(lesson, { status: 201 });
    } catch (error) {
        console.log("[LESSON_DELETE]", error);
        return NextResponse.json(
            { message: "Unable to delete lesson" },
            { status: 500 }
        );
    }
}
