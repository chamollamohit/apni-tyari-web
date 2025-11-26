import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { courseId } = await params;

        const values = await req.json();

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized: Admin access required" },
                { status: 401 }
            );
        }

        const course = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course, { status: 200 });
    } catch (error) {
        console.log("[COURSE_ID_PATCH]", error);
        return new NextResponse("Unable to update Course", { status: 500 });
    }
}
