"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { GraduationCap, Pencil, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, Teacher } from "@prisma/client";
import { cn } from "@/lib/utils";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface TeachersFormProps {
    initialData: Course & { teachers: Teacher[] };
    courseId: string;
    options: { teacherName: string; teacherId: string }[];
}

const formSchema = z.object({
    teacherIds: z.array(z.string()),
});

export const TeachersForm = ({
    initialData,
    courseId,
    options,
}: TeachersFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teacherIds: initialData.teachers.map((teacher) => teacher.id),
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const teacherIds = useWatch({
        control: form.control,
        name: "teacherIds",
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course faculty updated");
            toggleEdit();
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

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Faculty
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit faculty
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {initialData.teachers.length === 0 && (
                        <p className="text-slate-500 text-sm italic">
                            No teachers assigned
                        </p>
                    )}
                    {initialData.teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="flex items-center gap-x-2 bg-sky-100 border border-sky-200 text-sky-700 rounded-md px-2 py-1 text-sm font-medium"
                        >
                            <GraduationCap className="h-4 w-4" />
                            {teacher.name}
                        </div>
                    ))}
                </div>
            )}

            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="teacherIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex flex-col gap-y-2">
                                            {field.value.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {options
                                                        .filter((opt) =>
                                                            field.value.includes(
                                                                opt.teacherId
                                                            )
                                                        )
                                                        .map((opt) => (
                                                            <Badge
                                                                key={
                                                                    opt.teacherId
                                                                }
                                                                variant="secondary"
                                                                className="px-2 py-1"
                                                            >
                                                                {
                                                                    opt.teacherName
                                                                }
                                                                <button
                                                                    type="button"
                                                                    className="ml-1 hover:text-red-500"
                                                                    onClick={() => {
                                                                        const newValue =
                                                                            field.value.filter(
                                                                                (
                                                                                    id
                                                                                ) =>
                                                                                    id !==
                                                                                    opt.teacherId
                                                                            );
                                                                        field.onChange(
                                                                            newValue
                                                                        );
                                                                    }}
                                                                >
                                                                    x
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                </div>
                                            )}

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between bg-white",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        Select teachers...
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search faculty..." />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No teacher
                                                                found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {options.map(
                                                                    (
                                                                        option
                                                                    ) => (
                                                                        <CommandItem
                                                                            value={
                                                                                option.teacherName
                                                                            }
                                                                            key={
                                                                                option.teacherId
                                                                            }
                                                                            onSelect={() => {
                                                                                const currentIds =
                                                                                    field.value;
                                                                                if (
                                                                                    currentIds.includes(
                                                                                        option.teacherId
                                                                                    )
                                                                                ) {
                                                                                    // Teacher Exist so remove it
                                                                                    field.onChange(
                                                                                        currentIds.filter(
                                                                                            (
                                                                                                id
                                                                                            ) =>
                                                                                                id !==
                                                                                                option.teacherId
                                                                                        )
                                                                                    );
                                                                                } else {
                                                                                    // Teacher not exist so add it
                                                                                    field.onChange(
                                                                                        [
                                                                                            ...currentIds,
                                                                                            option.teacherId,
                                                                                        ]
                                                                                    );
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    field.value.includes(
                                                                                        option.teacherId
                                                                                    )
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {
                                                                                option.teacherName
                                                                            }
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
};
