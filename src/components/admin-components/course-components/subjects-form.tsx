"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Loader2,
    PlusCircle,
    BookOpen,
    Pencil,
    MoreVertical,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, Subject } from "@prisma/client";
import { cn } from "@/lib/utils";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubjectsFormProps {
    initialData: Course & { subjects: Subject[] };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1, { message: "Subject title is required" }),
});

export const SubjectsForm = ({ initialData, courseId }: SubjectsFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const toggleCreating = () => setIsCreating((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/subjects`, values);
            toast.success("Subject created");
            toggleCreating();
            form.reset();
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data || "Something went wrong";
                toast.error(errorMessage);
            } else {
                toast.error("Network error. Please check your connection.");
            }
        }
    };

    const onEdit = (id: string) => {
        // Redirects to the Subject Manager
        router.push(`/admin/courses/${courseId}/subjects/${id}`);
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Subjects
                <Button onClick={toggleCreating} variant="ghost" size="sm">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Subject
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Physics' or 'Chemistry'"
                                            {...field}
                                            className="bg-white border-slate-300 focus-visible:ring-slate-900"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            className="bg-black text-white hover:bg-slate-800"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}

            {!isCreating && (
                <div
                    className={cn(
                        "text-sm mt-2",
                        !initialData.subjects.length && "text-slate-500 italic"
                    )}
                >
                    {!initialData.subjects.length && "No subjects added yet."}

                    <div className="flex flex-col gap-y-2">
                        {initialData.subjects.map((subject) => (
                            <div
                                key={subject.id}
                                className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-3 text-sm shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-x-3">
                                    {/* Minimal Icon Style: Slate/Black instead of Blue */}
                                    <div className="p-2 bg-slate-100 text-slate-700 rounded-md">
                                        <BookOpen className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium text-slate-900">
                                        {subject.title}
                                    </span>
                                </div>

                                <div className="flex items-center gap-x-2">
                                    {/* Edit Button */}
                                    <Button
                                        onClick={() => onEdit(subject.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-slate-100"
                                    >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Manage
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!isCreating && initialData.subjects.length > 0 && (
                <p className="text-xs text-muted-foreground mt-4">
                    Click &quot;Manage&quot; to add chapters and assign teachers
                    to a subject.
                </p>
            )}
        </div>
    );
};
