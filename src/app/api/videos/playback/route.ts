import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { s3Key, lessonId } = await req.json();

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const isAdmin = session.user.role === "ADMIN";

        if (!isAdmin) {
            if (!lessonId) return new NextResponse("Lesson ID required", { status: 400 });

            const lesson = await db.lesson.findUnique({
                where: {
                    id: lessonId
                },
                include: {
                    chapter: {
                        include: {
                            subject: {
                                include: {
                                    course: {
                                        include: {
                                            purchases: {
                                                where: {
                                                    userId: session.user.id,
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            if (!lesson) {
                return new NextResponse("Lesson not found", { status: 404 });
            }

            const hasPurchase = lesson.chapter.subject.course.purchases.length > 0;
            const isFree = lesson?.isFree;

            if (!hasPurchase && !isFree) {
                return new NextResponse("Access Denied", { status: 403 });
            }
        }

        const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY!.replace(/\\n/g, '\n');

        const signedUrl = getSignedUrl({
            url: `${process.env.CLOUDFRONT_DOMAIN}/${s3Key}`,
            keyPairId: process.env.CLOUDFRONT_PUBLIC_KEY_ID!,
            privateKey: privateKey,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 2).toISOString(),
        });

        return NextResponse.json({ url: signedUrl });
    } catch (error) {
        console.error("[CLOUDFRONT_SIGN_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}