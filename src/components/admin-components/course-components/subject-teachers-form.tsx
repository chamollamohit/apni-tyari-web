"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { GraduationCap, Pencil, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Subject, Teacher } from "@prisma/client";
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

interface SubjectTeachersFormProps {
    initialData: Subject & { teachers: Teacher[] };
    courseId: string;
    subjectId: string;
    options: { label: string; value: string }[];
}

const formSchema = z.object({
    teacherIds: z.array(z.string()),
});

export const SubjectTeachersForm = ({
    initialData,
    courseId,
    subjectId,
    options,
}: SubjectTeachersFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teacherIds: initialData.teachers.map((teacher) => teacher.id),
        },
    });

    const teacherIds = useWatch({ control: form.control, name: "teacherIds" });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(
                `/api/courses/${courseId}/subjects/${subjectId}`,
                values
            );
            toast.success("Faculty assignments updated");
            toggleEdit();
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

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Assigned Faculty
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        "Cancel"
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" /> Assign
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
                            className="flex items-center gap-x-2 bg-white border border-slate-200 text-slate-700 rounded-md px-2 py-1 text-sm font-medium shadow-sm"
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
                                            {/* Selected Badges */}
                                            {field.value.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {options
                                                        .filter((opt) =>
                                                            field.value.includes(
                                                                opt.value
                                                            )
                                                        )
                                                        .map((opt) => (
                                                            <Badge
                                                                key={opt.value}
                                                                variant="secondary"
                                                                className="bg-white border-slate-300 text-slate-800 px-2 py-1"
                                                            >
                                                                {opt.label}
                                                                <button
                                                                    type="button"
                                                                    className="ml-1 hover:text-red-500"
                                                                    onClick={() => {
                                                                        field.onChange(
                                                                            field.value.filter(
                                                                                (
                                                                                    id
                                                                                ) =>
                                                                                    id !==
                                                                                    opt.value
                                                                            )
                                                                        );
                                                                    }}
                                                                >
                                                                    ×
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
                                                        className="w-full justify-between bg-white"
                                                    >
                                                        Select faculty...
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search teachers..." />
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
                                                                                option.label
                                                                            }
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            onSelect={() => {
                                                                                const currentIds =
                                                                                    field.value;
                                                                                if (
                                                                                    currentIds.includes(
                                                                                        option.value
                                                                                    )
                                                                                ) {
                                                                                    field.onChange(
                                                                                        currentIds.filter(
                                                                                            (
                                                                                                id
                                                                                            ) =>
                                                                                                id !==
                                                                                                option.value
                                                                                        )
                                                                                    );
                                                                                } else {
                                                                                    field.onChange(
                                                                                        [
                                                                                            ...currentIds,
                                                                                            option.value,
                                                                                        ]
                                                                                    );
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    field.value.includes(
                                                                                        option.value
                                                                                    )
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {
                                                                                option.label
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
