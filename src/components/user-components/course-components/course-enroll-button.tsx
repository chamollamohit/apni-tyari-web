"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name: string;
        email: string;
    };
    theme: {
        color: string;
    };
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => { open: () => void };
    }
}

export const CourseEnrollButton = ({
    price,
    courseId,
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const loadScript = (src: string) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const onCheckout = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(
                `/api/courses/${courseId}/checkout`
            );
            const data = response.data;

            const res = await loadScript(
                "https://checkout.razorpay.com/v1/checkout.js"
            );
            if (!res) {
                toast.error("Razorpay SDK failed to load");
                return;
            }

            // RazorPay Options
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: data.amount,
                currency: data.currency,
                name: "Apni Tyari",
                description: data.courseName,
                order_id: data.orderId,

                // RazorPay Handler
                handler: async function (response: RazorpayResponse) {
                    try {
                        await axios.post(`/api/courses/${courseId}/verify`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        toast.success("Enrolled Successfully!");
                        router.push(`/dashboard`);
                        router.refresh();
                    } catch {
                        toast.error("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: data.userName,
                    email: data.userEmail,
                },
                theme: {
                    color: "#000000",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    toast.error("Please login to purchase");
                    router.push(`/login?callbackUrl=${pathname}`);
                } else {
                    toast.error(
                        error.response?.data?.message || "Something went wrong"
                    );
                }
            } else {
                toast.error("Network error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={onCheckout}
            disabled={isLoading}
            size="lg"
            className="w-full bg-black text-white hover:bg-slate-800 text-lg py-6 font-bold shadow-lg"
        >
            {isLoading ? "Processing..." : `Enroll for ${formatPrice(price)}`}
        </Button>
    );
};
