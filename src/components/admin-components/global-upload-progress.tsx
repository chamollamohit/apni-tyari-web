"use client";
import { useUpload } from "@/hooks/use-upload";

export default function GlobalUploadProgress() {
    const { uploading, progress, fileName } = useUpload();

    if (!uploading) return null;

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white border shadow-lg rounded-lg p-4 z-50">
            <p className="text-sm font-medium truncate mb-2">
                Uploading: {fileName}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-right text-xs mt-1">{progress}%</p>
        </div>
    );
}
