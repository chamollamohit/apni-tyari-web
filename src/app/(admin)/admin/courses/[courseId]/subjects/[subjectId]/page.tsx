import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import {
    LayoutDashboard,
    ListChecks,
    ArrowLeft,
    GraduationCap,
} from "lucide-react";
import Link from "next/link";

import { SubjectTitleForm } from "@/components/admin-components/course-components/subject-title-form";
import { ChaptersForm } from "@/components/admin-components/course-components/chapters-form";
import { SubjectTeachersForm } from "@/components/admin-components/course-components/subject-teachers-form";

export default async function SubjectIdPage({
    params,
}: {
    params: Promise<{ courseId: string; subjectId: string }>;
}) {
    const { courseId, subjectId } = await params;
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") return redirect("/");

    // 1. Fetch Subject with its relations
    const subject = await db.subject.findUnique({
        where: { id: subjectId },
        include: {
            chapters: { orderBy: { position: "asc" } },
            teachers: true,
        },
    });

    if (!subject) return redirect(`/admin/courses/${courseId}`);

    // 2. Fetch All Teachers
    const allTeachers = await db.teacher.findMany({
        orderBy: { name: "asc" },
    });

    // 3. Completion Check
    const requiredFields = [
        subject.title,
        subject.teachers.length > 0,
        subject.chapters.length > 0,
    ];
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${requiredFields.length})`;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/admin/courses/${courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Course Setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Subject Setup
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                {/* LEFT COLUMN: Metadata & Teachers */}
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="p-2 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                            <LayoutDashboard size={20} />
                        </div>
                        <h2 className="text-xl font-semibold">
                            Subject Details
                        </h2>
                    </div>

                    {/* 1. Title Form */}
                    <SubjectTitleForm
                        initialData={subject}
                        courseId={courseId}
                        subjectId={subject.id}
                    />

                    {/* 2. Teachers Selector (Reused!) */}
                    <div className="flex items-center gap-x-2 mt-10">
                        <div className="p-2 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                            <GraduationCap size={20} />
                        </div>
                        <h2 className="text-xl font-semibold">
                            Subject Faculty
                        </h2>
                    </div>
                    <SubjectTeachersForm
                        initialData={subject}
                        courseId={courseId}
                        subjectId={subjectId}
                        options={allTeachers.map((t) => ({
                            label: t.name,
                            value: t.id,
                        }))}
                    />
                </div>

                {/* RIGHT COLUMN: Chapters */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="p-2 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                                <ListChecks size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">Chapters</h2>
                        </div>

                        {/* 3. Chapters Form */}
                        <ChaptersForm
                            initialData={subject}
                            courseId={courseId}
                            subjectId={subjectId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
