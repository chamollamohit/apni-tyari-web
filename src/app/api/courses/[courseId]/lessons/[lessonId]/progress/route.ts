import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { lessonId } = await params;
        const { isCompleted } = await req.json();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            update: {
                isCompleted,
            },
            create: {
                userId,
                lessonId,
                isCompleted,
            },
        });

        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("[LESSON_PROGRESS]", error);
        return NextResponse.json(
            { message: "Internal Error" },
            { status: 500 }
        );
    }
}
