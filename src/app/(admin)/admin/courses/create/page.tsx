"use client";

import * as z from "zod";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

export default function CreateCoursePage() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // 1. Call the API
            const response = await axios.post("/api/courses", values);

            // 2. Redirect to the Edit Page using the new ID
            router.push(`/admin/courses/${response.data.id}`);
            toast.success("Course created");
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(
                    error.response?.data.message || "Something went wrong"
                );
            } else {
                toast.error("Network error. Please check your connection");
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div className="w-full max-w-2xl border p-8 rounded-xl shadow-sm bg-white">
                <h1 className="text-2xl font-bold">Name your course</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your course? Don&apos;t worry,
                    you can change this later.
                </p>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Advanced Next.js Mastery'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you teach in this course?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Link href="/admin/courses">
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
