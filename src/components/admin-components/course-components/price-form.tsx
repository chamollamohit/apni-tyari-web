"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number(),
    originalPrice: z.coerce.number().optional(),
});

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined,
            originalPrice: initialData?.originalPrice || undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const price = useWatch({ control: form.control, name: "price" });
    const originalPrice = useWatch({
        control: form.control,
        name: "originalPrice",
    });

    const discountPercentage =
        price && originalPrice && Number(originalPrice) > Number(price)
            ? Math.round(
                  ((Number(originalPrice) - Number(price)) /
                      Number(originalPrice)) *
                      100
              )
            : 0;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Price updated");
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
                Course Pricing
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit price
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <div
                    className={cn(
                        "text-sm mt-2",
                        !initialData.price && "text-slate-500 italic"
                    )}
                >
                    {initialData.price ? (
                        <div className="flex items-center gap-x-2">
                            <span className="text-2xl font-bold text-slate-900">
                                {formatPrice(initialData.price)}
                            </span>
                            {initialData.originalPrice && (
                                <span className="text-slate-500 line-through text-sm">
                                    {formatPrice(initialData.originalPrice)}
                                </span>
                            )}
                            {initialData.originalPrice &&
                                initialData.price <
                                    initialData.originalPrice && (
                                    <span className="text-green-700 font-bold text-xs bg-green-100 px-2 py-1 rounded-full border border-green-200">
                                        {Math.round(
                                            ((initialData.originalPrice -
                                                initialData.price) /
                                                initialData.originalPrice) *
                                                100
                                        )}
                                        % OFF
                                    </span>
                                )}
                        </div>
                    ) : (
                        "No price set"
                    )}
                </div>
            )}

            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="originalPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">
                                            MRP (Original)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                disabled={isSubmitting}
                                                placeholder="e.g. 5000"
                                                {...field}
                                                value={
                                                    (field.value as number) ??
                                                    ""
                                                }
                                                className="bg-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">
                                            Selling Price
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                disabled={isSubmitting}
                                                placeholder="e.g. 3500"
                                                {...field}
                                                value={
                                                    (field.value as number) ??
                                                    ""
                                                }
                                                className="bg-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {discountPercentage > 0 && (
                            <div className="text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-100 flex items-center justify-between">
                                <span>Discount Applied:</span>
                                <span className="font-bold">
                                    {discountPercentage}% OFF
                                </span>
                            </div>
                        )}

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
