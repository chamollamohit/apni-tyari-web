import { MobileSidebar } from "@/components/admin-components/mobile-sidebar";
import { Sidebar } from "../../../components/admin-components/sidebar";
import { UploadProvider } from "@/components/providers/upload-provider";
import GlobalUploadProgress from "@/components/admin-components/global-upload-progress";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>

            <main className="md:pl-56 min-h-screen bg-gray-50">
                <div className="md:hidden h-20 fixed inset-y-0 w-full z-50 px-6 flex items-center bg-white border-b shadow-sm">
                    <MobileSidebar />
                </div>

                <div className="pt-20 md:pt-0 h-full">
                    <UploadProvider>
                        {children}
                        <GlobalUploadProgress />
                    </UploadProvider>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
