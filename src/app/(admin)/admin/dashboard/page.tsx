import { CheckCircle, Clock, DollarSign } from "lucide-react";
import { InfoCard } from "@/components/admin-components/info-card";
// import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {
    // TODO: Fetch real data from Prisma DB
    // const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InfoCard icon={Clock} label="In Progress" numberOfItems="12" />
                <InfoCard
                    icon={CheckCircle}
                    label="Completed"
                    numberOfItems="4"
                    variant="success"
                />
                <InfoCard
                    icon={DollarSign}
                    label="Total Revenue"
                    numberOfItems="$1,200.00"
                    variant="success"
                />
            </div>

            {/* Example: A section for recent activity or a chart */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="rounded-md border bg-white p-8 text-center text-sm text-muted-foreground">
                    No courses purchased yet.
                </div>
            </div>
        </div>
    );
}
