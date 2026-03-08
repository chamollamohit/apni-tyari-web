import { db } from "@/lib/db";
import { VideoTable } from "@/components/admin-components/secure-video-components/video-table";

export default async function SecureVideosPage() {
    const videos = await db.video.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Secure Video Library</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your private S3 content
                </p>
            </div>
            <VideoTable videos={videos} />
        </div>
    );
}
