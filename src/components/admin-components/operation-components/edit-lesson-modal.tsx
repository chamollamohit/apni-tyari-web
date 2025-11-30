"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Video, FileText } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/admin-components/file-upload";

const formSchema = z.object({
    videoUrl: z.string().optional(),
    notesUrl: z.string().optional(),
});

interface EditLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId: string;
    initialData: { videoUrl?: string | null; notesUrl?: string | null };
    type: "video" | "notes";
}

export const EditLessonModal = ({
    isOpen,
    onClose,
    lessonId,
    initialData,
    type,
}: EditLessonModalProps) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoUrl: initialData.videoUrl || "",
            notesUrl: initialData.notesUrl || "",
        },
    });

    // Reset form when modal opens with new data
    useEffect(() => {
        form.reset({
            videoUrl: initialData.videoUrl || "",
            notesUrl: initialData.notesUrl || "",
        });
    }, [initialData, form, isOpen]);

    const { isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/lessons/${lessonId}`, values);
            toast.success(type === "video" ? "Video updated" : "Notes updated");
            router.refresh();
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Unable to Update Data"
                );
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {type === "video" ? (
                            <Video className="h-5 w-5" />
                        ) : (
                            <FileText className="h-5 w-5" />
                        )}
                        {type === "video" ? "Add Video Link" : "Upload Notes"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 py-2"
                    >
                        {/* MODE A: VIDEO INPUT */}
                        {type === "video" && (
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>YouTube URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. https://youtube.com/watch?v=..."
                                                {...field}
                                                className="bg-white"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* MODE B: FILE UPLOAD */}
                        {type === "notes" && (
                            <FormField
                                control={form.control}
                                name="notesUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PDF Document</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-black text-white hover:bg-slate-800"
                        >
                            Save Content
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
