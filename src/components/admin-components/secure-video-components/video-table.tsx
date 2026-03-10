"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { formatBytes } from "@/lib/format";
import { useState } from "react";
import { VideoPlayerModal } from "./video-player-modal";
import { Video } from "@prisma/client";

interface VideoTableProps {
    videos: Video[];
}

export const VideoTable = ({ videos }: VideoTableProps) => {
    const [videoModal, setVideoModal] = useState<{
        key: string;
    } | null>(null);
    const onWatch = async (key: string) => {
        setVideoModal({ key });
    };

    return (
        <div>
            <div className="flex items-end">
                <VideoPlayerModal
                    isOpen={!!videoModal}
                    onClose={() => setVideoModal(null)}
                    videoKey={videoModal?.key || null}
                />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-end">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell className="font-medium">
                                    {video.key}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            video.status === "COMPLETED"
                                                ? "default"
                                                : "secondary"
                                        }>
                                        {video.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{formatBytes(video.size)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {video.status === "COMPLETED" ? (
                                        <Button
                                            onClick={() => onWatch(video.key)}>
                                            <Play className="h-4 w-4 mr-2" />{" "}
                                            Watch
                                        </Button>
                                    ) : (
                                        <Badge variant="secondary">
                                            Processing...
                                        </Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {videos.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center">
                                    No videos found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
