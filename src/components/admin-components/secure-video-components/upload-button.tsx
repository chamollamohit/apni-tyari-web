"use client";
import { useUpload } from "@/hooks/use-upload";
import { useRef } from "react";
import { Upload, Loader2 } from "lucide-react";

export default function UploadVideo() {
    const { startUpload, uploading } = useUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            startUpload(file);
            e.target.value = "";
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/mp4"
                className="hidden"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`
                    w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
                    ${
                        uploading
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                    }
                `}>
                {uploading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4" />
                        Upload Video
                    </>
                )}
            </button>
        </>
    );
}
