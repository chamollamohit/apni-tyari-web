"use client";
import {} from "plyr";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { VideoPlayer } from "./video-player";

interface VideoPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string | null;
}

export const VideoPlayerModal = ({
    isOpen,
    onClose,
    videoUrl,
}: VideoPlayerModalProps) => {
    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}>
            <DialogContent className="max-w-7xl p-0 overflow-hidden bg-black border-none">
                <DialogHeader className="p-4 bg-white">
                    <DialogTitle className="text-lg font-semibold truncate text-center">
                        Video Player
                    </DialogTitle>
                </DialogHeader>

                <div className="relative aspect-video w-full flex items-center justify-center bg-black">
                    {!videoUrl ? (
                        <div className="flex flex-col items-center gap-2 text-white">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className="text-sm">Generating secure link...</p>
                        </div>
                    ) : (
                        <VideoPlayer videoSrc={videoUrl} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
