import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { TeacherImageForm } from "@/components/admin-components/teacher-components/teacher-image-form";
import { TeacherDetailsForm } from "@/components/admin-components/teacher-components/teacher-details-form";

export default async function TeacherIdPage({
    params,
}: {
    params: Promise<{ teacherId: string }>;
}) {
    const { teacherId } = await params;
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") return redirect("/");

    const teacher = await db.teacher.findUnique({
        where: { id: teacherId },
    });

    if (!teacher) return redirect("/admin/teachers");

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-y-2">
                    <Link
                        href="/admin/teachers"
                        className="flex items-center text-sm hover:opacity-75 transition mb-2"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                    </Link>
                    <h1 className="text-2xl font-medium">Teacher Setup</h1>
                    <span className="text-sm text-slate-700">
                        Complete the profile for {teacher.name}
                    </span>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <TeacherDetailsForm
                        initialData={teacher}
                        teacherId={teacher.id}
                    />
                </div>
                <div>
                    <TeacherImageForm
                        initialData={teacher}
                        teacherId={teacher.id}
                    />
                </div>
            </div>
        </div>
    );
}
