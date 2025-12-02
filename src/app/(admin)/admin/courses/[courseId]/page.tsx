import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import {
    LayoutDashboard,
    CircleDollarSign,
    ListFilter,
    BookOpen,
    IndianRupee,
} from "lucide-react";

import { TitleForm } from "@/components/admin-components/course-components/title-form";
import { DescriptionForm } from "@/components/admin-components/course-components/description-form";
import { ImageForm } from "@/components/admin-components/course-components/image-form";
import { PriceForm } from "@/components/admin-components/course-components/price-form";
import { MetadataForm } from "@/components/admin-components/course-components/metadata-form";
import { SubjectsForm } from "@/components/admin-components/course-components/subjects-form";
import { PublishButton } from "@/components/admin-components/course-components/publish-button";
import { VideoForm } from "@/components/admin-components/course-components/video-form";

export default async function CourseIdPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;

    if (!/^[0-9a-fA-F]{24}$/.test(courseId)) {
        return redirect("/admin/courses");
    }

    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        return redirect("/");
    }

    // 1. Fetch Course
    const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
            subjects: {
                orderBy: { position: "asc" },
            },
        },
    });

    if (!course) {
        return redirect("/admin/courses");
    }

    // 2. Completion Logic
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.category,
        course.courseLanguage,
        course.target,
        course.subjects.length > 0,
        course.promotionalVideoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course Setup</h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
                <PublishButton
                    disabled={!isComplete}
                    courseId={course.id}
                    isPublished={course.isPublished}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                {/* --- LEFT COLUMN: DETAILS --- */}
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="p-2 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                            <LayoutDashboard size={20} />
                        </div>
                        <h2 className="text-xl font-semibold">Basic Details</h2>
                    </div>
                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm initialData={course} courseId={course.id} />

                    <div className="flex items-center gap-x-2 mt-12">
                        <div className="p-2 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                            <ListFilter size={20} />
                        </div>
                        <h2 className="text-xl font-semibold">Metadata</h2>
                    </div>
                    <VideoForm initialData={course} courseId={course.id} />
                    <MetadataForm initialData={course} courseId={course.id} />
                </div>

                {/* --- RIGHT COLUMN: CURRICULUM & PRICE --- */}
                <div className="space-y-6">
                    {/* 1. Subjects (The Curriculum Container) */}
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="p-2 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                                <BookOpen size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">Subjects</h2>
                        </div>
                        <SubjectsForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>

                    {/* 2. Pricing */}
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="p-2 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                                <IndianRupee size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">Pricing</h2>
                        </div>
                        <PriceForm initialData={course} courseId={course.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
