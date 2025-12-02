import { db } from "@/lib/db";
import { Course, Subject, Chapter, Lesson } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
    subjects: (Subject & {
        chapters: (Chapter & {
            lessons: Lesson[];
        })[];
    })[];
    progress: number | null;
};

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
    userId: string
): Promise<DashboardCourses> => {
    try {
        const purchases = await db.purchase.findMany({
            where: { userId },
            select: {
                course: {
                    include: {
                        subjects: {
                            include: {
                                chapters: {
                                    where: { isPublished: true },
                                    include: {
                                        lessons: {
                                            where: { isPublished: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const courses = purchases.map(
            (purchase) => purchase.course
        ) as CourseWithProgressWithCategory[];

        for (const course of courses) {
            const allLessons = course.subjects.flatMap((subject) =>
                subject.chapters.flatMap((chapter) => chapter.lessons)
            );

            const allLessonIds = allLessons.map((lesson) => lesson.id);

            // if no lesson in Course Progress will be Default 0
            if (allLessonIds.length === 0) {
                course.progress = 0;
                continue;
            }

            const validCompletedLessons = await db.userProgress.count({
                where: {
                    userId: userId,
                    lessonId: {
                        in: allLessonIds,
                    },
                    isCompleted: true,
                },
            });

            const progressPercentage =
                (validCompletedLessons / allLessons.length) * 100;

            course.progress = progressPercentage;
        }

        const completedCourses = courses.filter(
            (course) => course.progress === 100
        );

        const coursesInProgress = courses.filter(
            (course) => (course.progress ?? 0) < 100
        );

        return {
            completedCourses,
            coursesInProgress,
        };
    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]", error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        };
    }
};
