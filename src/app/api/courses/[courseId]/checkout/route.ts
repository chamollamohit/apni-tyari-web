import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import Razorpay from "razorpay";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { courseId } = await params;
        const user = session?.user;

        if (!user || !user.id || !user.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const course = await db.course.findUnique({
            where: { id: courseId, isPublished: true },
        });

        if (!course) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
        }

        // 1. Check if already purchased
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId,
                },
            },
        });

        if (purchase) {
            return NextResponse.json(
                { message: "Already purchased" },
                { status: 400 }
            );
        }

        // 2. Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        // 3. Create Order
        // Total Ammount
        const amount = Math.round((course.price || 0) * 100);

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `course_${courseId}`,
            notes: {
                courseId: courseId,
                userId: user.id,
            },
        };

        const order = await razorpay.orders.create(options);

        // 4. Return Order ID to Frontend
        return NextResponse.json({
            orderId: order.id,
            amount: amount,
            currency: "INR",
            courseName: course.title,
            courseDescription: course.description,
            userEmail: user.email,
            userName: user.name,
        });
    } catch (error) {
        console.log("[RAZORPAY_ORDER]", error);
        return NextResponse.json(
            { message: "Internal Error" },
            { status: 500 }
        );
    }
}
