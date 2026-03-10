"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, Lock, Loader2 } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import "plyr-react/plyr.css";

const Plyr = dynamic(() => import("plyr-react").then((mod) => mod.Plyr), {
    ssr: false,
});

interface VideoPlayerProps {
    url: string | null;
    source: "S3" | "YOUTUBE";
    lessonId?: string;
}

export const VideoPlayer = ({ url, lessonId, source }: VideoPlayerProps) => {
    const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(source === "S3");

    useEffect(() => {
        const getUrl = async () => {
            if (source === "YOUTUBE") {
                setResolvedUrl(url);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await axios.post("/api/videos/playback", {
                    s3Key: url,
                    lessonId,
                });

                setResolvedUrl(response.data.url);
            } catch (error) {
                console.error("Failed to sign URL", error);
            } finally {
                setIsLoading(false);
            }
        };

        getUrl();
    }, [url, source, lessonId]);

    const videoOptions = {
        controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "fullscreen",
        ],
        settings: ["quality", "speed"],
    };

    const getYoutubeId = (link: string) => {
        const regex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = link.match(regex);
        return match ? match[1] : null;
    };

    const plyrSource =
        source === "YOUTUBE" && resolvedUrl
            ? {
                  type: "video" as const,
                  sources: [
                      {
                          src: getYoutubeId(resolvedUrl) || "",
                          provider: "youtube" as const,
                      },
                  ],
              }
            : {
                  type: "video" as const,
                  sources: [{ src: resolvedUrl || "", type: "video/mp4" }],
              };

    return (
        <div
            className={cn(
                "relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 shadow-lg",
            )}>
            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
            ) : !resolvedUrl ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <AlertCircle className="h-10 w-10 mb-2" />
                    <p className="text-sm">Video not found</p>
                </div>
            ) : (
                <div className="w-full h-full">
                    <Plyr
                        key={resolvedUrl}
                        source={plyrSource}
                        options={videoOptions}
                    />
                </div>
            )}
        </div>
    );
};
