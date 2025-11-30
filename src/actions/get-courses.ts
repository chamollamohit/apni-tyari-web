import { db } from "@/lib/db";
import { CourseCategory, Course } from "@prisma/client";

type GetCourses = {
    title?: string;
    categoryId?: CourseCategory;
};

export const getCourses = async ({
    title,
    categoryId,
}: GetCourses): Promise<Course[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                    mode: "insensitive", // Search "physics" finds "Physics"
                },
                category: categoryId,
            },
            include: {
                subjects: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return courses;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
};
