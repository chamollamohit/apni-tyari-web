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

        if (session?.user?.role !== "ADMIN")
            return new NextResponse("Unauthorized", { status: 401 });

        const course = await db.course.findUnique({
            where: { id: courseId },
            include: { subjects: true },
        });

        if (!course)
            return new NextResponse("Courese Not found", { status: 404 });

        const publishedCourse = await db.course.update({
            where: { id: courseId },
            data: { isPublished: false },
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_PUBLISH]", error);
        return new NextResponse("Unable to Publish Course", { status: 500 });
    }
}
