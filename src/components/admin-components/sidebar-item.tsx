"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // Shadcn's class merger
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    // Check if active
    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    };

    return (
        <Button
            onClick={onClick}
            variant="ghost"
            size="lg"
            className={cn(
                "flex items-center justify-start gap-x-2 w-full pl-6 mb-1 font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all",
                isActive &&
                    "text-slate-950 bg-slate-100 border-r-4 border-slate-900 rounded-none"
            )}
        >
            <Icon
                size={22}
                className={cn("text-slate-500", isActive && "text-slate-950")}
            />
            {label}
        </Button>
    );
};
