import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

// Create Subject
export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { courseId } = await params;
        const { title } = await req.json();

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!title) {
            return NextResponse.json(
                { message: "Title is required" },
                { status: 400 }
            );
        }

        // 1. Find the last subject to determine the new position
        const lastSubject = await db.subject.findFirst({
            where: { courseId: courseId },
            orderBy: { position: "desc" },
        });

        const newPosition = lastSubject ? lastSubject.position + 1 : 1;

        // 2. Create the Subject
        const subject = await db.subject.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition,
            },
        });

        return NextResponse.json(subject, { status: 201 });
    } catch (error) {
        console.log("[SUBJECTS_POST]", error);
        return NextResponse.json(
            { message: "Unable to create subject" },
            { status: 500 }
        );
    }
}
