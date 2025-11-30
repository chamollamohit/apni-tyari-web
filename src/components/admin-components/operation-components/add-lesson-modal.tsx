"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Chapter, Teacher } from "@prisma/client";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    chapterId: z.string({ error: "Chapter is required" }),
    teacherId: z
        .string({ error: "Teacher is required" })
        .min(1, "Teacher is required"),
    date: z.date({ error: "Date is required" }),
    time: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be HH:MM"),
});

interface AddLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    chapters: Chapter[];
    teachers: Teacher[];
}

export const AddLessonModal = ({
    isOpen,
    onClose,
    chapters,
    teachers,
}: AddLessonModalProps) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            time: "10:00",
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // 1. Merge Date & Time
            const dateTime = new Date(values.date);
            const [hours, minutes] = values.time.split(":").map(Number);
            dateTime.setHours(hours, minutes);

            // 2. Call API
            await axios.post(`/api/lessons`, {
                title: values.title,
                chapterId: values.chapterId,
                teacherId: values.teacherId,
                date: dateTime.toISOString(),
            });

            toast.success("Class scheduled successfully");
            router.refresh();
            onClose();
            form.reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Failed to schedule"
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
                    <DialogTitle>Schedule New Class</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 py-2"
                    >
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lesson Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. Doubt Session - Rotational Motion"
                                            {...field}
                                            className="bg-white border-slate-300 focus-visible:ring-slate-900"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Dropdowns Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="chapterId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chapter</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white border-slate-300">
                                                    <SelectValue placeholder="Select Chapter" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {chapters.map((c) => (
                                                    <SelectItem
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="teacherId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Faculty</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white border-slate-300">
                                                    <SelectValue placeholder="Select Teacher" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {teachers.map((t) => (
                                                    <SelectItem
                                                        key={t.id}
                                                        value={t.id}
                                                    >
                                                        {t.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Date & Time Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal bg-white border-slate-300",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP"
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    className="bg-white border-slate-300 pl-10"
                                                />
                                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-black text-white hover:bg-slate-800"
                        >
                            Schedule Class
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
