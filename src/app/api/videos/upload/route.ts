import { NextRequest, NextResponse } from "next/server";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {

    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const timestamp = Date.now();
        const randomId = crypto.randomBytes(4).toString("hex");
        const key = `videos/${timestamp}-${randomId}.mp4`;

        const video = await db.video.create({
            data: {
                bucketId: process.env.AWS_BUCKET!,
                key: key,
                mimeType: 'video/mp4',
                size: 0
            }
        })

        const s3Client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY!,
                secretAccessKey: process.env.AWS_SECRET_KEY!,
            }
        })

        const { fields, url } = await createPresignedPost(s3Client, {
            Bucket: process.env.AWS_BUCKET!,
            Key: video.key,
            Conditions: [["content-length-range", 1048576, 52428800], ["starts-with", "$Content-Type", "video/"]],
            Expires: 120
        })

        return NextResponse.json({ fields, url }, { status: 200 })
    } catch (error) {
        console.error("[AWS_SIGN_URL_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}