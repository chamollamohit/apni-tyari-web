import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
    req: NextRequest
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id, status } = await req.json();

        const video = await db.video.update({
            where: {
                id
            },
            data: {
                status,
            },
        });

        return NextResponse.json(video);
    } catch (error) {
        console.error("[VIDEO_PATCH_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { id } = await req.json();

        await db.video.delete({
            where: {
                id,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[VIDEO_DELETE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}