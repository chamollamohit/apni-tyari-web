"use client";
import React, { createContext, useState } from "react";
import axios from "axios";

interface UploadContextType {
    uploading: boolean;
    progress: number;
    fileName: string;
    startUpload: (file: File) => Promise<void>;
}

export const UploadContext = createContext<UploadContextType | undefined>(
    undefined,
);

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");

    const startUpload = async (file: File) => {
        try {
            setUploading(true);
            setFileName(file.name);
            setProgress(0);

            const res = await fetch("/api/videos/upload", { method: "POST" });
            const { url, fields } = await res.json();

            const formData = new FormData();
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            formData.append("Content-Type", file.type);
            formData.append("file", file);

            await axios.post(url, formData, {
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) /
                            (progressEvent.total || 100),
                    );
                    setProgress(percent);
                },
            });

            alert("Upload successful!");
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <UploadContext.Provider
            value={{ uploading, progress, fileName, startUpload }}>
            {children}
        </UploadContext.Provider>
    );
};
