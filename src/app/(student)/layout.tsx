import Footer from "@/components/user-components/footer";
import { Navbar } from "@/components/user-components/navbar";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className=" flex-1  bg-slate-50">{children}</main>
            <Footer />
        </div>
    );
};

export default StudentLayout;
