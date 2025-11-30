import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

import { Button } from "@/components/ui/button";
import { CourseTable } from "@/components/admin-components/course-components/course-table";

export default async function CoursesPage() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Courses</h1>
                <Link href="/admin/courses/create">
                    <Button>+ New Course</Button>
                </Link>
            </div>

            <CourseTable courses={courses} />
        </div>
    );
}
