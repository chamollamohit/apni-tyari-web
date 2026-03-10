"use client";
import dynamic from "next/dynamic";
import "plyr-react/plyr.css";

const Plyr = dynamic(() => import("plyr-react").then((mod) => mod.Plyr), {
    ssr: false,
    loading: () => (
        <div className="aspect-video bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
            <span className="text-slate-400 text-sm">Loading Player...</span>
        </div>
    ),
});

export const VideoPlayer = ({ videoSrc }: { videoSrc: string }) => {
    const videoUrl = `${videoSrc}`;

    const plyrProps = {
        source: {
            type: "video" as const,
            sources: [
                {
                    src: videoUrl,
                    type: "video/mp4",
                },
            ],
        },
        options: {
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
            speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        },
    };

    return (
        <div className="w-full h-full overflow-hidden">
            <Plyr {...plyrProps} />
        </div>
    );
};
