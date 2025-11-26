"use client";

import Link from "next/link";
import { Course } from "@prisma/client";
import { Pencil, MoreHorizontal } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CourseTableProps {
    courses: Course[];
}

export const CourseTable = ({ courses }: CourseTableProps) => {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center h-24 text-muted-foreground"
                            >
                                No courses found.
                            </TableCell>
                        </TableRow>
                    )}

                    {courses.map((course) => (
                        <TableRow key={course.id}>
                            {/* 1. Title */}
                            <TableCell className="font-medium">
                                {course.title}
                            </TableCell>

                            {/* 2. Price (Formatted) */}
                            <TableCell>
                                {course.price
                                    ? new Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: "INR",
                                      }).format(course.price)
                                    : "-"}
                            </TableCell>

                            {/* 3. Status Badge */}
                            <TableCell>
                                <Badge
                                    variant={
                                        course.isPublished
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {course.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </TableCell>

                            {/* 4. Actions Dropdown */}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                        >
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <Link
                                            href={`/admin/courses/${course.id}`}
                                        >
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
