"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
    course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
    // Calculate Discount %
    const discount =
        course.originalPrice && course.price
            ? Math.round(
                  ((course.originalPrice - course.price) /
                      course.originalPrice) *
                      100
              )
            : 0;

    return (
        <Link href={`/courses/${course.id}`}>
            <div className="group hover:shadow-md transition overflow-hidden border rounded-lg h-full flex flex-col bg-white">
                {/* Image Container */}
                <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-slate-100">
                    {course.imageUrl ? (
                        <Image
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                            alt={course.title}
                            src={course.imageUrl}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            <BookOpen className="h-10 w-10 text-slate-300" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col p-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-bold text-slate-500 border-slate-200"
                        >
                            {course.category || "General"}
                        </Badge>
                        {discount > 0 && (
                            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-1 transition-colors">
                        {course.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                        {course.target
                            ? `Target: ${course.target.replace("_", " ")}`
                            : "All Students"}
                    </p>

                    {/* Pricing Footer */}
                    <div className="mt-auto flex items-center gap-x-2">
                        {course.price ? (
                            <>
                                <p className="text-lg font-bold text-slate-900">
                                    {formatPrice(course.price)}
                                </p>
                                {course.originalPrice && (
                                    <p className="text-xs text-slate-400 line-through">
                                        {formatPrice(course.originalPrice)}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-lg font-bold text-slate-900">
                                Free
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
