"use server";

import { db } from "@/lib/db";
import { unstable_noStore } from "next/cache";

export const getVideos = async () => {
    unstable_noStore();
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