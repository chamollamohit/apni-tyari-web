"use client";

import Link from "next/link";
import {
    Clapperboard,
    GraduationCap,
    LayoutDashboard,
    List,
    LogOut,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { Button } from "@/components/ui/button"; // For the Exit button

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
        icon: Clapperboard,
        label: "Batch Operations",
        href: "/admin/operations",
    },
];

export const Sidebar = () => {
    return (
        <div className="h-full border-r bg-white flex flex-col overflow-y-auto">
            <div className="p-6 h-[80px] flex items-center border-b">
                <Link href="/">
                    <div className="flex items-center gap-x-2">
                        <div className="h-8 w-8 rounded-md bg-black flex items-center justify-center">
                            <span className="text-white font-bold">E</span>
                        </div>

                        <h1 className="font-bold text-xl text-black">
                            EdAdmin
                        </h1>
                    </div>
                </Link>
            </div>

            {/* 2. Navigation Routes */}
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

            {/* 3. Footer / Exit Button */}
            <div className="mt-auto p-4 border-t">
                <Link href="/">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-x-2"
                    >
                        <LogOut size={18} />
                        Exit to Website
                    </Button>
                </Link>
            </div>
        </div>
    );
};
