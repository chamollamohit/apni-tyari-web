"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Pencil, Grip, LayoutList } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Subject } from "@prisma/client";
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
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({ title: z.string().min(1) });

interface ChaptersFormProps {
    initialData: Subject & { chapters: Chapter[] };
    courseId: string;
    subjectId: string;
}

export const ChaptersForm = ({
    initialData,
    courseId,
    subjectId,
}: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "" },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(
                `/api/courses/${courseId}/subjects/${subjectId}/chapters`,
                values
            );
            toast.success("Chapter created");
            setIsCreating(false);
            form.reset();
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Something went wrong"
                );
            } else {
                toast.error("Network error");
            }
        }
    };

    const onEdit = (chapterId: string) => {
        router.push(
            `/admin/courses/${courseId}/subjects/${subjectId}/chapters/${chapterId}`
        );
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Subject Chapters
                <Button
                    onClick={() => setIsCreating(!isCreating)}
                    variant="ghost"
                >
                    {isCreating ? (
                        "Cancel"
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" /> Add Chapter
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
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                            placeholder="e.g. 'Kinematics'"
                                            {...field}
                                            className="bg-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={
                                !form.formState.isValid ||
                                form.formState.isSubmitting
                            }
                            type="submit"
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
                        !initialData.chapters.length && "text-slate-500 italic"
                    )}
                >
                    {!initialData.chapters.length && "No chapters added yet."}

                    <div className="flex flex-col gap-y-2">
                        {initialData.chapters.map((chapter) => (
                            <div
                                key={chapter.id}
                                className="flex items-center justify-between bg-white border rounded-md p-3 text-sm"
                            >
                                <div className="flex items-center gap-x-2">
                                    <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
                                        <LayoutList className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">
                                        {chapter.title}
                                    </span>
                                    {chapter.isPublished && (
                                        <Badge className="bg-green-600">
                                            Published
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    onClick={() => onEdit(chapter.id)}
                                    variant="ghost"
                                    size="sm"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
