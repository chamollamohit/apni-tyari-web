"use client";

import * as z from "zod";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { format } from "date-fns";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MetadataFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    category: z.string().min(1),
    courseLanguage: z.string().min(1),
    target: z.string().min(1),
    duration: z.string().optional(),
    validity: z.date().optional(),
});

export const MetadataForm = ({ initialData, courseId }: MetadataFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: initialData?.category || "",
            courseLanguage: initialData?.courseLanguage || "",
            target: initialData?.target || "",
            duration: initialData?.duration || "",
            validity: initialData?.validity
                ? new Date(initialData.validity)
                : undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course details updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data || "Something went wrong");
            } else {
                toast.error("Network error. Please check your connection");
            }
        }
    };

    const formatEnum = (str: string) => {
        return str?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Highlights & Metadata
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit info
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase font-bold">
                            Category
                        </span>
                        <span className="font-medium">
                            {initialData.category || "--"}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase font-bold">
                            Language
                        </span>
                        <span className="font-medium">
                            {formatEnum(initialData.courseLanguage || "--")}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase font-bold">
                            Target Class
                        </span>
                        <span className="font-medium">
                            {formatEnum(initialData.target || "--")}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase font-bold">
                            Validity Ends
                        </span>
                        <span className="font-medium">
                            {initialData.validity
                                ? format(new Date(initialData.validity), "PPP")
                                : "--"}
                        </span>
                    </div>
                </div>
            )}

            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 1. CATEGORY */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="NEET">
                                                    NEET
                                                </SelectItem>
                                                <SelectItem value="JEE">
                                                    JEE
                                                </SelectItem>
                                                <SelectItem value="UPSC">
                                                    UPSC
                                                </SelectItem>
                                                <SelectItem value="FOUNDATION">
                                                    Foundation
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            {/* 2. LANGUAGE */}
                            <FormField
                                control={form.control}
                                name="courseLanguage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Language</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="HINGLISH">
                                                    Hinglish
                                                </SelectItem>
                                                <SelectItem value="ENGLISH">
                                                    English
                                                </SelectItem>
                                                <SelectItem value="HINDI">
                                                    Hindi
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            {/* 3. TARGET AUDIENCE */}
                            <FormField
                                control={form.control}
                                name="target"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Class</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Select Target" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="CLASS_11">
                                                    Class 11
                                                </SelectItem>
                                                <SelectItem value="CLASS_12">
                                                    Class 12
                                                </SelectItem>
                                                <SelectItem value="DROPPER">
                                                    Dropper
                                                </SelectItem>
                                                <SelectItem value="FOUNDATION">
                                                    Foundation
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            {/* 4. DURATION */}
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (Text)</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 60 Hours"
                                                {...field}
                                                className="bg-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* 5. VALIDITY */}
                            <FormField
                                control={form.control}
                                name="validity"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Validity Ends On</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal bg-white",
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
                                                    disabled={(date) =>
                                                        date <
                                                        new Date(
                                                            new Date().setHours(
                                                                0,
                                                                0,
                                                                0,
                                                                0
                                                            )
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Save Details
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
};
