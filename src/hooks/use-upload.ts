import { UploadContext } from "@/components/providers/upload-provider";
import { useContext } from "react";

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context)
        throw new Error("useUpload must be used within UploadProvider");
    return context;
};
