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
import { Play, Trash, Loader2 } from "lucide-react";
import { formatBytes } from "@/lib/format";
import { useState } from "react";
import { VideoPlayerModal } from "./video-player-modal";
import { Video } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface VideoTableProps {
    videos: Video[];
}

export const VideoTable = ({ videos }: VideoTableProps) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [videoModal, setVideoModal] = useState<{
        key: string;
    } | null>(null);

    const onWatch = async (key: string) => {
        setVideoModal({ key });
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete("/api/videos", {
                data: { id },
            });
            toast.success("Video entry deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <VideoPlayerModal
                isOpen={!!videoModal}
                onClose={() => setVideoModal(null)}
                videoKey={videoModal?.key || null}
            />

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>File Key</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell className="font-medium truncate max-w-[200px]">
                                    {video.key}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            video.status === "COMPLETED"
                                                ? "default"
                                                : video.status === "FAILED"
                                                  ? "destructive"
                                                  : "secondary"
                                        }>
                                        {video.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{formatBytes(video.size)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {video.status === "COMPLETED" && (
                                        <Button
                                            size="sm"
                                            onClick={() => onWatch(video.key)}>
                                            <Play className="h-4 w-4 mr-2" />{" "}
                                            Watch
                                        </Button>
                                    )}

                                    {video.status === "PENDING" && (
                                        <Badge
                                            variant="outline"
                                            className="animate-pulse">
                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                            Processing
                                        </Badge>
                                    )}

                                    {(video.status === "FAILED" ||
                                        video.status === "COMPLETED") && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={deletingId === video.id}
                                            onClick={() => onDelete(video.id)}>
                                            {deletingId === video.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash className="h-4 w-4" />
                                            )}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {videos.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
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
