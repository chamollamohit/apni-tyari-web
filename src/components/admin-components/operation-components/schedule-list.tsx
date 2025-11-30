"use client";

import { format, isToday, isTomorrow } from "date-fns";
import { Lesson, Teacher, Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Video,
    FileText,
    CheckCircle2,
    MoreVertical,
    Trash2,
    CalendarClock,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { EditLessonModal } from "./edit-lesson-modal";

interface ScheduleListProps {
    items: (Lesson & {
        chapter: Chapter;
        teacher: Teacher | null;
    })[];
}

type ScheduleItem = Lesson & {
    chapter: Chapter;
    teacher: Teacher | null;
};

export const ScheduleList = ({ items }: ScheduleListProps) => {
    const router = useRouter();

    const [editingLesson, setEditingLesson] = useState<ScheduleItem | null>(
        null
    );
    const [editType, setEditType] = useState<"video" | "notes">("video");

    const onOpenEdit = (lesson: ScheduleItem, type: "video" | "notes") => {
        setEditingLesson(lesson);
        setEditType(type);
    };

    // Delete Handler
    const onDelete = async (id: string) => {
        try {
            await axios.delete(`/api/lessons/${id}`);
            toast.success("Lesson deleted");
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Unable to Delete Lesson"
                );
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    // Group Lessons by Date Key (YYYY-MM-DD)
    const grouped = items.reduce((acc, lesson) => {
        const dateKey = format(new Date(lesson.date!), "yyyy-MM-dd");

        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(lesson);
        return acc;
    }, {} as Record<string, typeof items>);

    // Sort Keys by Date
    const sortedDates = Object.keys(grouped).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });

    // Empty State
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-2 text-slate-500 bg-slate-50 border border-slate-200 border-dashed rounded-lg">
                <CalendarClock className="h-10 w-10 mb-2 opacity-20" />
                <p className="font-medium">No lessons scheduled</p>
                <p className="text-xs">
                    Upload an Excel file or add a lesson manually.
                </p>
            </div>
        );
    }

    return (
        <>
            {editingLesson && (
                <EditLessonModal
                    isOpen={!!editingLesson}
                    onClose={() => setEditingLesson(null)}
                    lessonId={editingLesson.id}
                    initialData={{
                        videoUrl: editingLesson.videoUrl,
                        notesUrl: editingLesson.notesUrl,
                    }}
                    type={editType}
                />
            )}
            <div className="space-y-8 pb-10">
                {sortedDates.map((dateKey) => {
                    const lessons = grouped[dateKey];
                    const dateObj = new Date(dateKey);

                    // Header

                    let headerText = format(dateObj, "EEEE, d MMMM yyyy");
                    if (isToday(dateObj)) headerText = "Today • " + headerText;
                    if (isTomorrow(dateObj))
                        headerText = "Tomorrow • " + headerText;

                    return (
                        <div key={dateKey} className="space-y-3">
                            {/* Date Header Strip */}
                            <div className="flex items-center gap-x-3 sticky top-0 bg-gray-50/95 backdrop-blur-sm py-2 z-10">
                                <div
                                    className={
                                        "w-2 h-2 rounded-full bg-slate-90"
                                    }
                                />
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                                    {headerText}
                                </h3>
                                <div className="h-[1px] flex-1 bg-slate-200"></div>
                                <span className="text-xs text-slate-400 font-mono">
                                    {lessons.length} Classes
                                </span>
                            </div>

                            {/* List of Lesson Cards */}
                            <div className="grid grid-cols-1 gap-3">
                                {lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="group bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                                    >
                                        {/* LEFT: Time & Metadata */}
                                        <div className="flex items-center gap-x-4">
                                            {/* Time Box */}
                                            <div className="flex flex-col items-center justify-center w-16 h-14 bg-slate-50 rounded-md border border-slate-100 group-hover:bg-slate-100 transition">
                                                {lesson.date ? (
                                                    <>
                                                        <span className="text-sm font-bold text-slate-900">
                                                            {format(
                                                                new Date(
                                                                    lesson.date
                                                                ),
                                                                "HH:mm"
                                                            )}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 uppercase">
                                                            {format(
                                                                new Date(
                                                                    lesson.date
                                                                ),
                                                                "a"
                                                            )}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        --:--
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title & Faculty */}
                                            <div className="flex flex-col">
                                                <h4 className="font-semibold text-slate-900 text-sm md:text-base">
                                                    {lesson.title}
                                                </h4>
                                                <div className="flex items-center gap-x-2 text-xs text-slate-500 mt-1.5">
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-normal bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100"
                                                    >
                                                        {lesson.chapter.title}
                                                    </Badge>
                                                    <span>•</span>
                                                    <span className="flex items-center font-medium text-slate-700 ">
                                                        {lesson.teacher?.name ||
                                                            "No Faculty Assigned"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT: Status & Actions */}
                                        <div className="flex items-center gap-x-4 md:gap-x-8">
                                            {/* Status Indicators (Visible on Desktop) */}
                                            <div className="hidden md:flex items-center gap-x-6">
                                                {/* Video Indicator */}
                                                <div className="flex flex-col items-center gap-1 w-10">
                                                    {lesson.videoUrl ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                                                    )}
                                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                                                        Video
                                                    </span>
                                                </div>

                                                {/* Notes Indicator */}
                                                <div className="flex flex-col items-center gap-1 w-10">
                                                    {lesson.notesUrl ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                                                    )}
                                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                                                        Notes
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Dropdown */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-40"
                                                >
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            onOpenEdit(
                                                                lesson,
                                                                "video"
                                                            )
                                                        }
                                                    >
                                                        <Video className="mr-2 h-4 w-4" />
                                                        {lesson.videoUrl
                                                            ? "Edit Video"
                                                            : "Add Video"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            onOpenEdit(
                                                                lesson,
                                                                "notes"
                                                            )
                                                        }
                                                    >
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        {lesson.notesUrl
                                                            ? "Edit Notes"
                                                            : "Add Notes"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onDelete(lesson.id)
                                                        }
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
