import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { lessonId } = await params;

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        // Delete a single lesson
        const lesson = await db.lesson.delete({
            where: { id: lessonId },
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[LESSON_DELETE]", error);
        return NextResponse.json(
            { message: "Unable to delete lesson" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { lessonId } = await params;
        const values = await req.json();

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const lesson = await db.lesson.update({
            where: { id: lessonId },
            data: {
                ...values,
            },
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[LESSON_PATCH]", error);
        return NextResponse.json(
            { message: "Unable to update Lesson" },
            { status: 500 }
        );
    }
}
