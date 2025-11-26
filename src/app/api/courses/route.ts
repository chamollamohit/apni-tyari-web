import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        const userRole = session?.user?.role;

        if (!userId || userRole !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized: Admin access required" },
                { status: 401 }
            );
        }

        const { title } = await req.json();

        if (!title) {
            return NextResponse.json(
                { message: "Title is missing" },
                { status: 400 }
            );
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
            },
        });

        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        console.log("[COURSES_POST]", error);
        return NextResponse.json(
            { message: "Unable to create course" },
            { status: 500 }
        );
    }
}
