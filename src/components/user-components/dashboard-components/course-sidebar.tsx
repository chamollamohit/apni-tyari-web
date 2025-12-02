"use client";

import { Chapter, Lesson, Subject, UserProgress } from "@prisma/client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CheckCircle, PlayCircle, Lock } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface CourseSidebarProps {
    courseId: string;
    subjects: (Subject & {
        chapters: (Chapter & {
            lessons: (Lesson & {
                userProgress: UserProgress[];
            })[];
        })[];
    })[];
    progressCount: number;
}

export const CourseSidebar = ({
    courseId,
    subjects,
    progressCount,
}: CourseSidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold text-lg">Course Content</h1>
                <div className="mt-4">
                    <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-600 transition-all duration-300"
                            style={{ width: `${progressCount}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                        {Math.round(progressCount)}% Complete
                    </p>
                </div>
            </div>

            <div className="flex-1 w-full">
                <Accordion
                    type="multiple"
                    defaultValue={subjects.map((s) => s.id)}
                    className="w-full"
                >
                    {subjects.map((subject) => (
                        <div key={subject.id}>
                            {/* Subject Header */}
                            <div className="px-4 py-3 bg-slate-50 border-y font-bold text-xs uppercase text-slate-500 tracking-wider">
                                {subject.title}
                            </div>

                            {subject.chapters.map((chapter) => (
                                <AccordionItem
                                    key={chapter.id}
                                    value={chapter.id}
                                    className="border-b-0"
                                >
                                    <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 hover:no-underline text-sm font-semibold text-slate-700">
                                        {chapter.title}
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-0 pb-0">
                                        {chapter.lessons.map((lesson) => {
                                            const isCompleted =
                                                lesson.userProgress?.[0]
                                                    ?.isCompleted;
                                            const isActive = pathname?.includes(
                                                lesson.id
                                            );

                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() =>
                                                        router.push(
                                                            `/courses/${courseId}/learn/lessons/${lesson.id}`
                                                        )
                                                    }
                                                    className={cn(
                                                        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-8 pr-4 py-3 transition-all hover:text-slate-600 hover:bg-slate-300/20 w-full",
                                                        isActive &&
                                                            "text-slate-700 bg-slate-100 border-r-4 border-slate-700",
                                                        isCompleted &&
                                                            "text-emerald-700 hover:text-emerald-700"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-x-2 py-1">
                                                        {isCompleted ? (
                                                            <CheckCircle className="text-emerald-700 h-4 w-4" />
                                                        ) : (
                                                            <PlayCircle
                                                                className={cn(
                                                                    "h-4 w-4",
                                                                    isActive
                                                                        ? "text-slate-700"
                                                                        : "text-slate-500"
                                                                )}
                                                            />
                                                        )}
                                                        <span className="line-clamp-1 text-left">
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </div>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};
