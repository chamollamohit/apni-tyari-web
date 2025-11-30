import { getCourses } from "@/actions/get-courses";
import { CourseCard } from "@/components/user-components/course-card";
import { SearchInput } from "@/components/user-components/search-input";
import { Categories } from "@/components/categories";
import { CourseCategory } from "@prisma/client";

interface SearchPageProps {
    searchParams: Promise<{
        title: string;
        categoryId: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { title, categoryId } = await searchParams;

    const courses = await getCourses({
        title,
        categoryId: categoryId as CourseCategory, // Cast string to Enum
    });

    return (
        <>
            <div className="px-6 pt-6 md:mb-0 block">
                <SearchInput />
            </div>

            <div className="p-6 space-y-4">
                {/* We will add Category Filter Pills here later */}
                {/* <Categories items={...} /> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {courses.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-10">
                        No courses found. Try searching for something else.
                    </div>
                )}
            </div>
        </>
    );
}
