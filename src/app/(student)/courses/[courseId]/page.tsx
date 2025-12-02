import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import {
    Globe,
    Clock,
    Calendar,
    MonitorPlay,
    FileText,
    CheckCircle2,
    GraduationCap,
    Target,
    PlayCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { VideoPlayer } from "@/components/user-components/course-components/video-player";
import { SubjectList } from "@/components/user-components/course-components/subject-list";
import { Preview } from "@/components/admin-components/course-components/preview";
import { format } from "date-fns";
import { CourseEnrollButton } from "@/components/user-components/course-components/course-enroll-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CourseDetailsPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const session = await getServerSession(authOptions);
    // 1. Fetch Course
    const course = await db.course.findUnique({
        where: {
            id: courseId,
            isPublished: true,
        },
        include: {
            subjects: {
                orderBy: { position: "asc" },
                include: {
                    chapters: {
                        where: { isPublished: true },
                        orderBy: { position: "asc" },
                        include: { lessons: true },
                    },
                    teachers: true,
                },
            },
        },
    });

    if (!course) {
        return redirect("/");
    }

    // 2. CHECK PURCHASE STATUS
    let hasPurchased = false;
    if (session?.user?.id) {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId,
                },
            },
        });
        hasPurchased = !!purchase;
    }

    const allTeachers = [
        ...course.subjects.flatMap((subject) => subject.teachers),
    ];

    // 2. Calculate Stats
    const discount =
        course.originalPrice && course.price
            ? Math.round(
                  ((course.originalPrice - course.price) /
                      course.originalPrice) *
                      100
              )
            : 0;

    const totalLessons = course.subjects.reduce(
        (acc, sub) =>
            acc +
            sub.chapters.reduce((cAcc, chap) => cAcc + chap.lessons.length, 0),
        0
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* 1. HERO HEADER  */}
            <div className="bg-slate-900 text-white pt-10 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Badge
                                variant="secondary"
                                className="bg-slate-700 text-white border-none hover:bg-slate-600"
                            >
                                {course.category}
                            </Badge>
                            <span className="text-slate-400 text-sm font-medium">
                                Last updated{" "}
                                {new Date(
                                    course.updatedAt
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            {course.title}
                        </h1>

                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-2 gap-6 text-sm font-medium text-slate-300 pt-2">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-yellow-400" />
                                Language: {course.courseLanguage || "English"}
                            </div>
                            {course.duration && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-yellow-400" />
                                    Course Duration: {course.duration}
                                </div>
                            )}
                            {course.startDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-yellow-400" />
                                    Start Date:{" "}
                                    {format(course.startDate, "PPP") ||
                                        "Will be Announced Soon"}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-yellow-400" />
                                Validity:{" "}
                                {course.validity
                                    ? format(course.validity, "PPP")
                                    : "Lifetime Access"}
                            </div>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-yellow-400" />
                                {course.category &&
                                    `For ${course.category} Students`}
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-yellow-400" />
                                Target:{" "}
                                {course.target
                                    ? course.target.replace("_", " ")
                                    : "All Grade"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- LEFT COLUMN: CONTENT (70%) --- */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* A. Preview Video Section (Card) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                Orientation Video
                            </h2>
                            <div className="aspect-video rounded-lg overflow-hidden border border-slate-100 bg-slate-900 relative">
                                {course.promotionalVideoUrl ? (
                                    <VideoPlayer
                                        title={course.title}
                                        url={course.promotionalVideoUrl}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full flex-col text-slate-500">
                                        <MonitorPlay className="h-12 w-12 mb-3 opacity-50" />
                                        <p className="font-medium">
                                            No preview available
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* B. What you'll learn / Description */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                About this course
                            </h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                <Preview value={course.description || ""} />
                            </p>
                        </div>

                        {/* C. Curriculum (Accordion) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Curriculum
                                </h2>
                                <span className="text-sm text-slate-500 font-medium">
                                    {course.subjects.length} Subjects
                                </span>
                            </div>
                            <SubjectList subjects={course.subjects} />
                        </div>

                        {/* D. Faculty Profiles */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                Know your Teachers
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allTeachers.map((teacher) => (
                                    <div
                                        key={teacher.id}
                                        className="flex items-start gap-4 p-4 border rounded-lg hover:border-slate-300 transition bg-slate-50/50"
                                    >
                                        <div className="h-14 w-14 rounded-full overflow-hidden relative border-2 border-white shadow-sm shrink-0">
                                            {teacher.imageUrl ? (
                                                <Image
                                                    src={teacher.imageUrl}
                                                    fill
                                                    className="object-cover"
                                                    alt={teacher.name}
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold">
                                                    {teacher.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                {teacher.name}
                                            </h3>
                                            <p className="text-xs font-semibold uppercase mb-1">
                                                {teacher.subject} Expert
                                            </p>
                                            <Badge variant={"outline"}>
                                                {teacher.exp}+ years of
                                                experience.
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: CHECKOUT CARD (Sticky) --- */}
                    <div className="lg:col-span-1 relative">
                        <div className="sticky top-24 flex flex-col gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg flex flex-col gap-y-6">
                                <div className="aspect-video relative w-full rounded-md overflow-hidden">
                                    <Image
                                        src={course.imageUrl!}
                                        alt="course-image"
                                        width={600}
                                        height={600}
                                    />
                                </div>

                                {/* Price Area */}
                                <div>
                                    <div className="flex items-end gap-x-2 mb-2">
                                        <div className="text-3xl font-extrabold text-slate-900">
                                            {course.price
                                                ? formatPrice(course.price)
                                                : "Free"}
                                        </div>
                                        {course.originalPrice && (
                                            <div className="text-slate-400 line-through font-medium mb-1.5">
                                                {formatPrice(
                                                    course.originalPrice
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {discount > 0 && (
                                        <div className="inline-flex items-center text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            {discount}% Discount Applied
                                        </div>
                                    )}
                                </div>

                                {/* Enrollment Button */}
                                {hasPurchased ? (
                                    <Link href="/dashboard">
                                        <Button className="w-full bg-black text-white hover:bg-slate-800 text-lg py-6 font-bold shadow-lg">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <CourseEnrollButton
                                        courseId={course.id}
                                        price={course.price || 0}
                                    />
                                )}

                                {/* Guarantees */}
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-x-2 text-sm text-slate-600">
                                        <MonitorPlay className="h-4 w-4" />
                                        <span>
                                            {totalLessons} video lessons
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-x-2 text-sm text-slate-600">
                                        <FileText className="h-4 w-4" />
                                        <span>Downloadable PDFs & Notes</span>
                                    </div>
                                    <div className="flex items-center gap-x-2 text-sm text-slate-600">
                                        <Clock className="h-4 w-4" />
                                        <span>Full lifetime access</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
