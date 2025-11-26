import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { LayoutDashboard, ListChecks } from "lucide-react";

import { TitleForm } from "@/components/admin-components/title-form";
// import { DescriptionForm } from "./_components/description-form";
// import { ImageForm } from "./_components/image-form";
// import { PriceForm } from "./_components/price-form";

export default async function CourseIdPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const session = await getServerSession(authOptions);
    const { courseId } = await params;

    // VALIDATION: Checking if couresId is a type of ObjectId (24 hex chars)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(courseId);
    if (!isValidObjectId) {
        return redirect("/admin/courses");
    }

    if (session?.user?.role !== "ADMIN") {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
    });

    if (!course) {
        return redirect("/admin/courses");
    }

    // Completion Logic: Check which fields are missing
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        // course.categoryId (Add later)
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course Setup</h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                {/* LEFT COLUMN: Basic Details */}
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="p-2 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                            <LayoutDashboard size={20} />
                        </div>
                        <h2 className="text-xl font-semibold">
                            Customize your course
                        </h2>
                    </div>

                    <TitleForm initialData={course} courseId={course.id} />

                    {/* We will uncomment these as we build them */}
                    {/* <DescriptionForm initialData={course} courseId={course.id} /> */}
                    {/* <ImageForm initialData={course} courseId={course.id} /> */}
                </div>

                {/* RIGHT COLUMN: Curriculum & Price */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="p-2 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                <ListChecks size={20} />
                            </div>
                            <h2 className="text-xl font-semibold">
                                Course Chapters
                            </h2>
                        </div>
                        {/* <ChaptersForm initialData={course} courseId={course.id} /> */}
                        <div className="p-4 border bg-slate-100 rounded-md mt-4 text-sm">
                            Chapters list coming soon...
                        </div>
                    </div>

                    {/* <PriceForm initialData={course} courseId={course.id} /> */}
                </div>
            </div>
        </div>
    );
}
