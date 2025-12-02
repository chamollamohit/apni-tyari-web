import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

// Update Subject
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; subjectId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { courseId, subjectId } = await params;
        const values = await req.json();

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify subject belongs to course
        const ownSubject = await db.subject.findUnique({
            where: {
                id: subjectId,
                courseId: courseId,
            },
        });

        if (!ownSubject) {
            return NextResponse.json(
                { message: "Subject not found" },
                { status: 404 }
            );
        }

        const subject = await db.subject.update({
            where: {
                id: subjectId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(subject);
    } catch (error) {
        console.log("[SUBJECT_PATCH]", error);
        return NextResponse.json(
            { message: "Subject update failed" },
            { status: 500 }
        );
    }
}

// 2. DELETE (Remove Subject)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string; subjectId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { courseId, subjectId } = await params;

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const ownSubject = await db.subject.findUnique({
            where: {
                id: subjectId,
                courseId: courseId,
            },
        });

        if (!ownSubject) {
            return NextResponse.json(
                { message: "Subject not found" },
                { status: 404 }
            );
        }

        const subject = await db.subject.delete({
            where: {
                id: subjectId,
            },
        });

        return NextResponse.json(subject);
    } catch (error) {
        console.log("[SUBJECT_DELETE]", error);
        return NextResponse.json(
            { message: "Internal Error" },
            { status: 500 }
        );
    }
}
