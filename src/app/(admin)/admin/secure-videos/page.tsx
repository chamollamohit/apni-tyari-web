import { VideoTable } from "@/components/admin-components/secure-video-components/video-table";
import UploadVideo from "@/components/admin-components/secure-video-components/upload-button";
import { getVideos } from "@/services/get-videos";

export default async function SecureVideosPage() {
    const videos = await getVideos();

    return (
        <div className="p-6  space-y-6">
            <div className="flex flex-row items-center justify-between p-6 border rounded-xl bg-white shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Secure Video Library
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your Videos
                    </p>
                </div>

                <div className="w-48">
                    <UploadVideo />
                </div>
            </div>
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                <VideoTable videos={videos} />
            </div>
        </div>
    );
}
