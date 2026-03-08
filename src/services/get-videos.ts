"use server";

import { db } from "@/lib/db";

export const getVideos = async () => {
    try {
        const videos = await db.video.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return videos;
    } catch (error) {
        console.error("[GET_VIDEOS]", error);
        return [];
    }
};