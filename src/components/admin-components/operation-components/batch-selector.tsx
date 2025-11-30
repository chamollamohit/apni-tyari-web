"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Course, Subject } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BatchSelectorProps {
    courses: (Course & { subjects: Subject[] })[];
}

export const BatchSelector = ({ courses }: BatchSelectorProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedCourseId = searchParams.get("courseId");
    const selectedSubjectId = searchParams.get("subjectId");

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);

    const onCourseChange = (courseId: string) => {
        router.push(`/admin/operations?courseId=${courseId}`);
    };

    const onSubjectChange = (subjectId: string) => {
        router.push(
            `/admin/operations?courseId=${selectedCourseId}&subjectId=${subjectId}`
        );
    };

    return (
        <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Dropdown */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">
                        Select Course
                    </Label>
                    <Select
                        value={selectedCourseId || ""}
                        onValueChange={onCourseChange}
                    >
                        <SelectTrigger className="bg-white border-slate-300 focus:ring-slate-900">
                            <SelectValue placeholder="Choose a Course..." />
                        </SelectTrigger>
                        <SelectContent>
                            {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">
                        Select Subject
                    </Label>
                    <Select
                        value={selectedSubjectId || ""}
                        onValueChange={onSubjectChange}
                        disabled={!selectedCourseId}
                    >
                        <SelectTrigger className="bg-white border-slate-300 focus:ring-slate-900">
                            <SelectValue
                                placeholder={
                                    !selectedCourseId
                                        ? "Select a batch first"
                                        : "Choose a subject..."
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedCourse?.subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                    {subject.title}
                                </SelectItem>
                            ))}
                            {selectedCourse?.subjects.length === 0 && (
                                <div className="p-2 text-sm text-slate-500 text-center">
                                    No subjects found.
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};
