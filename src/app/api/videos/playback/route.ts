import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: NextRequest) {


    try {
        const { s3Key } = await req.json()

        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY!.replace(/\\n/g, '\n');

        const signedUrl = getSignedUrl({
            url: `${process.env.CLOUDFRONT_DOMAIN}/${s3Key}`,
            keyPairId: process.env.CLOUDFRONT_PUBLIC_KEY_ID!,
            privateKey: privateKey,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 2).toISOString(),
        })

        return NextResponse.json({ url: signedUrl })
    } catch (error) {
        console.error("[CLOUDFRONT_SIGN_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}