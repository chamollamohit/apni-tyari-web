"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
    value: number;
    variant?: "default" | "success";
    size?: "default" | "sm";
}

const colorByVariant = {
    default: "text-slate-700",
    success: "text-green-700",
};

const sizeByVariant = {
    default: "text-sm",
    sm: "text-xs",
};

export const CourseProgress = ({
    value,
    variant,
    size,
}: CourseProgressProps) => {
    return (
        <div>
            <Progress
                className="h-2 bg-slate-200"
                value={value}
                // You might need to customize Progress color in global css or use utility classes
                indicatorClassName={cn(
                    variant === "success" ? "bg-green-600" : "bg-slate-900"
                )}
            />
            <p
                className={cn(
                    "font-medium mt-2 text-slate-500",
                    colorByVariant[variant || "default"],
                    sizeByVariant[size || "default"]
                )}
            >
                {Math.round(value)}% Complete
            </p>
        </div>
    );
};
