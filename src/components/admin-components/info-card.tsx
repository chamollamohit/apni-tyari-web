import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    numberOfItems: string;
    variant?: "default" | "success" | "warning";
}

export const InfoCard = ({
    icon: Icon,
    label,
    numberOfItems,
    variant = "default",
}: InfoCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{numberOfItems}</div>
                <p className="text-xs text-muted-foreground">
                    {variant === "success"
                        ? "+20% from last month"
                        : "No recent activity"}
                </p>
            </CardContent>
        </Card>
    );
};
