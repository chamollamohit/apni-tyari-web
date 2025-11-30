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
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name, email } = await req.json();

        if (!name) {
            return NextResponse.json(
                { message: "Name is required" },
                { status: 400 }
            );
        }

        const teacher = await db.teacher.create({
            data: {
                name,
                subject: "Subject",
                exp: "Experience",
                email,
            },
        });

        return NextResponse.json(teacher, { status: 201 });
    } catch (error) {
        console.log("[TEACHERS_POST]", error);
        return NextResponse.json(
            { message: "unable to create teacher profile" },
            { status: 500 }
        );
    }
}
