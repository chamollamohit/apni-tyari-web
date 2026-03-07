import { db } from "@/lib/db";
import { redisClient } from "@/lib/redis";
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

        const cacheKey = `courses:search:${title || "all"}:${categoryId || "all"}`;

        const cachedCourseData = await redisClient.get(cacheKey)
        if (cachedCourseData) {
            return JSON.parse(cachedCourseData)
        }

        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                    mode: "insensitive",
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
        if (courses.length > 0) {
            await redisClient.set(
                cacheKey,
                JSON.stringify(courses),
                "EX", 3600
            );
        }

        return courses;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
};
