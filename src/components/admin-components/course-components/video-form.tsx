"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, MonitorPlay } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VideoFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    promotionalVideoUrl: z
        .string()
        .min(1, { message: "Video URL is required" }),
});

export const VideoForm = ({ initialData, courseId }: VideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            promotionalVideoUrl: initialData?.promotionalVideoUrl || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Promotional Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            {initialData.promotionalVideoUrl ? (
                                <>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                    video
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" /> Add
                                    video
                                </>
                            )}
                        </>
                    )}
                </Button>
            </div>

            {!isEditing &&
                (!initialData.promotionalVideoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
                        <MonitorPlay className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <iframe
                            src={`https://www.youtube.com/embed/${
                                initialData.promotionalVideoUrl.split("v=")[1]
                            }?rel=0`}
                            className="w-full h-full rounded-md"
                            allowFullScreen
                        />
                    </div>
                ))}

            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="promotionalVideoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'https://www.youtube.com/watch?v=...'"
                                            {...field}
                                            className="bg-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
