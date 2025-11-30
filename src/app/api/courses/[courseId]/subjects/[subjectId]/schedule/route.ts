import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

// DELETE ALL SCHEDULE (Bulk Reset)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string; subjectId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { subjectId } = await params;

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Delete all chapters (which cascades to delete all lessons)
        await db.chapter.deleteMany({
            where: { subjectId: subjectId },
        });

        return NextResponse.json({ message: "Schedule reset successfully" });
    } catch (error) {
        console.log("[SCHEDULE_DELETE]", error);
        return NextResponse.json(
            { message: "Unable to reset schedule" },
            { status: 500 }
        );
    }
}
