"use client";

import Link from "next/link";
import {
    Clapperboard,
    GraduationCap,
    LayoutDashboard,
    List,
    LogOut,
    ShieldCheck,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const routes = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/admin/dashboard",
    },
    {
        icon: List,
        label: "Courses",
        href: "/admin/courses",
    },
    {
        icon: GraduationCap,
        label: "Teachers",
        href: "/admin/teachers",
    },
    {
        icon: ShieldCheck,
        label: "Batch Operations",
        href: "/admin/operations",
    },
    {
        icon: Clapperboard,
        label: "Secure Videos",
        href: "/admin/secure-videos",
    },
];

export const Sidebar = () => {
    return (
        <div className="h-full border-r bg-white flex flex-col overflow-y-auto">
            <div className="p-6 h-20 flex items-center border-b">
                <Link href="/">
                    <div className="flex items-center gap-x-2">
                        <div className="hidden md:block relative h-20 w-45">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="md:hidden relative h-10 w-10">
                            <Image
                                src="/mobile-logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </Link>
            </div>

            <div className="flex flex-col w-full mt-4">
                {routes.map((route) => (
                    <SidebarItem
                        key={route.href}
                        icon={route.icon}
                        label={route.label}
                        href={route.href}
                    />
                ))}
            </div>

            <div className="mt-auto p-4 border-t">
                <Link href="/">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-x-2">
                        <LogOut size={18} />
                        Exit to Website
                    </Button>
                </Link>
            </div>
        </div>
    );
};
