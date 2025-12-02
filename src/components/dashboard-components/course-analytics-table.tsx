"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseAnalyticsTableProps {
    data: {
        name: string;
        total: number;
        students: number;
    }[];
}

export const CourseAnalyticsTable = ({ data }: CourseAnalyticsTableProps) => {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Course Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Batch / Course Name</TableHead>
                                <TableHead className="text-center">
                                    Students Enrolled
                                </TableHead>
                                <TableHead className="text-center">
                                    Total Revenue
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.name}>
                                    <TableCell className="font-medium">
                                        {item.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.students}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {formatPrice(item.total)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center text-muted-foreground"
                                    >
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
