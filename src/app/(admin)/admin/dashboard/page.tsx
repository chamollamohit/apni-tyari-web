import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import {
    CreditCard,
    IndianRupee,
    Users,
    BookOpen,
    TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalytics } from "@/actions/get-analytics"; // The Backend Logic
import { CourseAnalyticsTable } from "@/components/dashboard-components/course-analytics-table";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return redirect("/");
    }

    // 1. Fetch Analytics Data (Revenue, Sales, Student Count per Course)
    const { data, totalRevenue, totalSales, uniqueStudents } =
        await getAnalytics();

    // 2. Fetch Total Active Batches count
    const totalCourses = await db.course.count({
        where: { isPublished: true },
    });

    return (
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-full">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Dashboard
                </h1>
                <p className="text-slate-500">
                    Overview of your performance and growth.
                </p>
            </div>

            {/* KPI Cards Row */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {formatPrice(totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 text-green-600" />{" "}
                            Lifetime earnings
                        </p>
                    </CardContent>
                </Card>

                {/* Total Sales */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Sales
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            +{totalSales}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Course purchases
                        </p>
                    </CardContent>
                </Card>

                {/* Active Students */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Students
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {uniqueStudents}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Unique enrollments
                        </p>
                    </CardContent>
                </Card>

                {/* Active Batches */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Batches
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {totalCourses}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Published courses
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-1">
                <CourseAnalyticsTable data={data} />
            </div>
        </div>
    );
}
