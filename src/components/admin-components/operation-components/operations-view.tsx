"use client";

import { Plus, Upload, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExcelUploadModal } from "./excel-upload-modal";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Lesson, Chapter, Teacher } from "@prisma/client";
import { ScheduleList } from "./schedule-list";
import { DateRangeFilter } from "./date-range-filter";
import { AddLessonModal } from "./add-lesson-modal";

type ScheduleItem = Lesson & {
    chapter: Chapter;
    teacher: Teacher | null;
};

interface OperationsViewProps {
    courseId: string;
    subjectId: string;
    scheduleData: ScheduleItem[];
    chapters: Chapter[];
    teachers: Teacher[];
}

export const OperationsView = ({
    courseId,
    subjectId,
    scheduleData,
    chapters,
    teachers,
}: OperationsViewProps) => {
    const router = useRouter();
    const [isExcelOpen, setIsExcelOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);

    // Bulk Delete Handler
    const onResetSchedule = async () => {
        try {
            setIsLoading(true);
            await axios.delete(
                `/api/courses/${courseId}/subjects/${subjectId}/schedule`
            );
            toast.success("Schedule reset successfully");
            router.refresh();
            setIsResetOpen(false);
        } catch {
            toast.error("Failed to reset schedule");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AlertDialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Reset Entire Schedule?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. It will permanently
                            delete
                            <strong> all chapters and lessons</strong> for this
                            subject.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                onResetSchedule();
                            }}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isLoading
                                ? "Deleting..."
                                : "Yes, Delete Everything"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Excel Upload Modal */}
            <ExcelUploadModal
                isOpen={isExcelOpen}
                onClose={() => setIsExcelOpen(false)}
                courseId={courseId}
                subjectId={subjectId}
            />
            {/* Add Lesson Modal */}
            <AddLessonModal
                isOpen={isAddLessonOpen}
                onClose={() => setIsAddLessonOpen(false)}
                chapters={chapters}
                teachers={teachers}
            />
            <div className="space-y-6">
                {/* 1. Action Toolbar */}
                <div className="flex items-center justify-between bg-white p-4 border rounded-lg shadow-sm">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Manage Schedule
                        </h2>

                        <p className="text-sm text-slate-500">
                            {scheduleData.length} lessons in view
                        </p>
                    </div>
                    {/* Date Range */}
                    <DateRangeFilter />

                    <div className="flex items-center gap-x-2">
                        {scheduleData.length > 0 && (
                            <Button
                                onClick={() => setIsResetOpen(true)}
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                        )}
                        {/* Excel Upload Button */}
                        <Button
                            onClick={() => setIsExcelOpen(true)}
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Excel
                        </Button>

                        {/* Add Lesson Button */}
                        <Button
                            onClick={() => setIsAddLessonOpen(true)}
                            className="bg-black text-white hover:bg-slate-800"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* 2. Content / Schedule List */}
                <div className="bg-white border rounded-lg min-h-[300px] flex items-center justify-center text-slate-500">
                    <ScheduleList items={scheduleData} />
                </div>
            </div>
        </>
    );
};
