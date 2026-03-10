"use client";

import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Video, FileText, Youtube, Lock } from "lucide-react";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/admin-components/file-upload";

const formSchema = z.object({
    videoUrl: z.string().optional(),
    videoSource: z.enum(["S3", "YOUTUBE"]),
    notesUrl: z.string().optional(),
});

interface EditLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId: string;
    initialData: {
        videoUrl?: string | null;
        videoSource: "S3" | "YOUTUBE";
        notesUrl?: string | null;
    };
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
            videoSource: initialData.videoSource,
            notesUrl: initialData.notesUrl || "",
        },
    });

    useEffect(() => {
        form.reset({
            videoUrl: initialData.videoUrl || "",
            videoSource: initialData.videoSource,
            notesUrl: initialData.notesUrl || "",
        });
    }, [initialData, form, isOpen]);

    const { isSubmitting } = form.formState;
    const currentVideoSource = useWatch({
        control: form.control,
        name: "videoSource",
        defaultValue: "S3",
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/lessons/${lessonId}`, values);
            toast.success(type === "video" ? "Video updated" : "Notes updated");
            router.refresh();
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Unable to Update Data",
                );
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}>
            <DialogContent className="bg-white sm:max-w-125">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {type === "video" ? (
                            <Video className="h-5 w-5" />
                        ) : (
                            <FileText className="h-5 w-5" />
                        )}
                        {type === "video"
                            ? "Configure Video Lesson"
                            : "Upload Notes"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 py-2">
                        {type === "video" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="videoSource"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video Source</FormLabel>
                                            <Select
                                                disabled={isSubmitting}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white">
                                                        <SelectValue placeholder="Select video source" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="S3">
                                                        <div className="flex items-center gap-2">
                                                            <Lock className="h-4 w-4" />
                                                            <span>
                                                                Secure Video
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="YOUTUBE">
                                                        <div className="flex items-center gap-2">
                                                            <Youtube className="h-4 w-4 text-red-600" />
                                                            <span>
                                                                YouTube Video
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="videoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {currentVideoSource === "S3"
                                                    ? "Secure Video Key"
                                                    : "YouTube URL"}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder={
                                                        currentVideoSource ===
                                                        "S3"
                                                            ? "processed-videos/example.mp4"
                                                            : "https://youtube.com/watch?v=..."
                                                    }
                                                    {...field}
                                                    className="bg-white"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

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
                            className="w-full bg-black text-white hover:bg-slate-800">
                            Save Content
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
