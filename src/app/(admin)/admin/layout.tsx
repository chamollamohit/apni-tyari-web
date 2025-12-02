import { MobileSidebar } from "@/components/admin-components/mobile-sidebar";
import { Sidebar } from "../../../components/admin-components/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            {/* Desktop Sidebar (Fixed) */}
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="md:pl-56 min-h-screen bg-gray-50">
                {/* Mobile Header */}
                <div className="md:hidden h-[80px] fixed inset-y-0 w-full z-50 px-6 flex items-center bg-white border-b shadow-sm">
                    <MobileSidebar />
                </div>

                <div className="pt-[80px] md:pt-0 h-full">{children}</div>
            </main>
        </div>
    );
};

export default AdminLayout;
