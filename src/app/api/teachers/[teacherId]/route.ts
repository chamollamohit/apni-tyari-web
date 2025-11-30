import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

// 1. UPDATE Teacher
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ teacherId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { teacherId } = await params;
        const values = await req.json();

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const teacher = await db.teacher.update({
            where: { id: teacherId },
            data: { ...values },
        });

        return NextResponse.json(teacher);
    } catch (error) {
        console.log("[TEACHER_PATCH]", error);
        return NextResponse.json(
            { message: "Unable to update teacher profile" },
            { status: 500 }
        );
    }
}

// 2. DELETE Teacher
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ teacherId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { teacherId } = await params;

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const teacher = await db.teacher.delete({
            where: { id: teacherId },
        });

        return NextResponse.json(teacher);
    } catch (error) {
        console.log("[TEACHER_DELETE]", error);
        return NextResponse.json(
            { message: "Unable to delete teacher profile" },
            { status: 500 }
        );
    }
}
