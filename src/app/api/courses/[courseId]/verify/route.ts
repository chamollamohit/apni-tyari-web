import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { courseId } = await params;
        const user = session?.user;

        if (!user || !user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            body;

        // 1. Signature Verification
        const bodyString = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(bodyString.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { message: "Invalid Signature" },
                { status: 400 }
            );
        }

        // 2. Fetch Course Price
        const course = await db.course.findUnique({
            where: { id: courseId },
            select: { price: true },
        });

        // 3. Create Purchase with Transaction Details
        await db.purchase.create({
            data: {
                userId: user.id,
                courseId: courseId,

                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                price: course?.price,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log("[PAYMENT_VERIFY]", error);
        return NextResponse.json(
            { message: "Internal Error" },
            { status: 500 }
        );
    }
}
