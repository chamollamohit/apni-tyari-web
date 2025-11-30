import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil } from "lucide-react";
import Image from "next/image";

export default async function TeachersPage() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return redirect("/");
    }

    const teachers = await db.teacher.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Faculty Members</h1>
                <Link href="/admin/teachers/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Teacher
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((teacher) => (
                    <div
                        key={teacher.id}
                        className="border rounded-lg p-4 bg-white flex items-center justify-between shadow-sm"
                    >
                        <div className="flex items-center gap-x-3">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border">
                                {teacher.imageUrl ? (
                                    <Image
                                        src={teacher.imageUrl}
                                        alt={teacher.name}
                                        className="h-full w-full object-cover"
                                        width={50}
                                        height={50}
                                    />
                                ) : (
                                    <span className="text-lg font-bold text-slate-500">
                                        {teacher.name[0]}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    {teacher.name}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {teacher.subject}
                                </p>
                            </div>
                        </div>
                        <Link href={`/admin/teachers/${teacher.id}`}>
                            <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                ))}
                {teachers.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-10">
                        No teachers found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
