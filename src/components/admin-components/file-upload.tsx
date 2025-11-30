"use client";

import Image from "next/image";
import { FileIcon, Loader2, UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
}

export const FileUpload = ({ onChange, value }: FileUploadProps) => {
    const fileType = value?.split(".").pop()?.toLowerCase();
    const [isUploading, setIsUploading] = useState(false);

    // Checking if the file is a PDF or an Image
    const isPDF = fileType === "pdf";
    const isImage = ["jpg", "jpeg", "png"].includes(fileType || "");

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Validation
        if (file.size > 10 * 1024 * 1024)
            toast.error("File is too large (Max 10MB)");

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "edtech_preset");

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                formData
            );
            console.log(response);

            // 3. Success
            onChange(response.data.secure_url);
            toast.success("Upload complete");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed. Check your internet or preset.");
        } finally {
            setIsUploading(false);
        }
    };

    // 1. IMAGE PREVIEW
    if (value && isImage) {
        return (
            <div className="relative h-40 w-40">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="object-cover rounded-md"
                />
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    // 2. PDF PREVIEW (File Icon)
    if (value && isPDF) {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-slate-100 border text-slate-800 w-fit">
                <FileIcon className="h-4 w-4 mr-2 shrink-0" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm line-clamp-1 underline hover:text-blue-600"
                >
                    View PDF
                </a>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    // 3. UPLOAD BUTTON
    return (
        <div className="flex items-center gap-4">
            <label className="cursor-pointer">
                <div className="flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 font-medium py-2 px-4 rounded-md transition-all text-sm shadow-sm">
                    {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <UploadCloud className="h-4 w-4" />
                    )}
                    {isUploading ? "Uploading..." : "Choose File"}
                </div>

                <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={onUpload}
                    disabled={isUploading}
                />
            </label>

            {isUploading && (
                <span className="text-xs text-slate-400 animate-pulse">
                    Please wait...
                </span>
            )}
        </div>
    );
};
