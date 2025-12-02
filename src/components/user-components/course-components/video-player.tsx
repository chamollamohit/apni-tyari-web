"use client";

import { useState } from "react";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    url: string;
    title?: string;
    isLocked?: boolean;
}

export const VideoPlayer = ({
    url,
    title,
    isLocked = false,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);

    // Helper: Extract YouTube ID

    const getVideoId = (link: string) => {
        if (!link) return null;
        const regex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = link.match(regex);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(url);

    return (
        <div
            className={cn(
                "relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg",
                isLocked && "bg-slate-100 border-slate-200"
            )}
        >
            {/* STATE 1: Link not valid  */}
            {!videoId ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <AlertCircle className="h-10 w-10 mb-2" />
                    <p className="text-sm">Video unavailable</p>
                </div>
            ) : (
                /* STATE 2: ACTIVE PLAYER */
                <>
                    {/* Loading Spinner (Visible until iframe loads) */}
                    {!isReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    )}

                    <iframe
                        className={cn(
                            "w-full h-full absolute top-0 left-0 transition-opacity duration-500",
                            isReady ? "opacity-100" : "opacity-0"
                        )}
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1&showinfo=0`}
                        title={title || "Video Player"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setIsReady(true)}
                    />
                </>
            )}
        </div>
    );
};
