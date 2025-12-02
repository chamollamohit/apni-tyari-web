"use client";

import axios from "axios";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonCompleteButtonProps {
    courseId: string;
    lessonId: string;
    isCompleted?: boolean;
    nextLessonId?: string;
}

export const LessonCompleteButton = ({
    courseId,
    lessonId,
    isCompleted,
    nextLessonId,
}: LessonCompleteButtonProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.put(
                `/api/courses/${courseId}/lessons/${lessonId}/progress`,
                {
                    isCompleted: !isCompleted,
                }
            );

            // If completing and there is a next lesson, ask to go there
            if (!isCompleted && nextLessonId) {
                toast.success("Lesson completed! Moving to next...");
                router.push(
                    `/courses/${courseId}/learn/lessons/${nextLessonId}`
                );
            } else {
                toast.success(
                    isCompleted ? "Progress reset" : "Lesson completed"
                );
                router.refresh();
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            variant={isCompleted ? "outline" : "default"}
            className={cn(
                "w-full md:w-auto flex items-center gap-x-2",
                isCompleted &&
                    "text-emerald-700 border-emerald-700 hover:bg-emerald-50",
                !isCompleted && "bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
        >
            {isCompleted ? (
                <>
                    <CheckCircle className="h-4 w-4" />
                    Completed
                </>
            ) : (
                <>
                    <CheckCircle className="h-4 w-4" />
                    Mark as Complete
                </>
            )}
        </Button>
    );
};
