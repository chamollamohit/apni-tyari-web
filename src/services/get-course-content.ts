import { db } from "@/lib/db";
import { Lesson, Chapter, Subject, UserProgress } from "@prisma/client";

type CourseContent = {
    subjects: (Subject & {
        chapters: (Chapter & {
            lessons: (Lesson & {
                userProgress: UserProgress[];
            })[];
        })[];
    })[];
};

export const getCourseContent = async (courseId: string, userId: string) => {
    try {
        const course = await db.course.findUnique({
            where: { id: courseId },
            include: {
                subjects: {
                    orderBy: { position: "asc" },
                    include: {
                        chapters: {
                            where: { isPublished: true },
                            orderBy: { position: "asc" },
                            include: {
                                lessons: {
                                    where: { isPublished: true },

                                    include: {
                                        userProgress: {
                                            where: { userId },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return course;
    } catch (error) {
        console.log("[GET_COURSE_CONTENT]", error);
        return null;
    }
};
