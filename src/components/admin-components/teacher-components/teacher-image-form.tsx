"use client";

import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Teacher } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/admin-components/file-upload";

interface TeacherImageFormProps {
    initialData: Teacher;
    teacherId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, { message: "Image is required" }),
});

export const TeacherImageForm = ({
    initialData,
    teacherId,
}: TeacherImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/teachers/${teacherId}`, values);
            toast.success("Profile photo updated");
            toggleEdit();
            router.refresh();
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
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Profile Photo
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add photo
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit photo
                        </>
                    )}
                </Button>
            </div>

            {!isEditing &&
                (!initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-square mt-2 w-40 mx-auto">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-full border-4 border-white shadow-sm"
                            src={initialData.imageUrl}
                        />
                    </div>
                ))}

            {isEditing && (
                <div className="mt-4">
                    <FileUpload
                        value={initialData.imageUrl || ""}
                        onChange={(url) => {
                            if (url) onSubmit({ imageUrl: url });
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4 text-center">
                        Recommended: Square image (1:1)
                    </div>
                </div>
            )}
        </div>
    );
};
