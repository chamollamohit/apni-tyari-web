import { db } from "@/lib/db";

export const getAnalytics = async () => {
    try {
        const purchases = await db.purchase.findMany({
            include: {
                course: true,
            },
        });

        // 1. Group by Course Title
        const groupedData: {
            [key: string]: { revenue: number; count: number };
        } = {};

        purchases.forEach((purchase) => {
            const courseTitle = purchase.course.title;
            const price = purchase.price || purchase.course.price || 0;

            if (!groupedData[courseTitle]) {
                groupedData[courseTitle] = { revenue: 0, count: 0 };
            }

            groupedData[courseTitle].revenue += price;
            groupedData[courseTitle].count += 1;
        });

        // 2. Formated Course Data
        const data = Object.entries(groupedData).map(
            ([courseTitle, stats]) => ({
                name: courseTitle,
                total: stats.revenue,
                students: stats.count,
            })
        );

        // 3. Totals Sales and Revenue
        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        // Unique students across entire platform
        const uniqueStudents = new Set(purchases.map((p) => p.userId)).size;

        return {
            data,
            totalRevenue,
            totalSales,
            uniqueStudents,
        };
    } catch (error) {
        console.log("[GET_ANALYTICS]", error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0,
            uniqueStudents: 0,
        };
    }
};
