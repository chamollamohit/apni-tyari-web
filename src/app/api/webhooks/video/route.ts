import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {

    const apiKey = req.headers.get('x-api-key')
    if (apiKey !== process.env.WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { s3Key, size, mimeType, status, bucketId } = await req.json();
    const fileName = s3Key.split('/').pop();
    try {
        await db.video.updateMany({
            where: { key: { contains: fileName } },
            data: {
                key: s3Key,
                status: status,
                size: size,
            },
        })

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log("[Video_Webook]", error);
        return NextResponse.json(
            { message: "Video Webhook failed" },
            { status: 500 }
        );
    }
}
