"use client";

import qs from "query-string";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
    label: string;
    value?: string;
    icon?: LucideIcon;
}

export const CategoryItem = ({
    label,
    value,
    icon: Icon,
}: CategoryItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    title: currentTitle,
                    categoryId: isSelected ? null : value,
                },
            },
            { skipNull: true, skipEmptyString: true }
        );

        router.push(url);
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-black transition cursor-pointer bg-white",
                isSelected &&
                    "border-black bg-black text-white hover:bg-slate-800"
            )}
            type="button"
        >
            {Icon && <Icon size={18} />}
            <div className="truncate font-medium">{label}</div>
        </button>
    );
};
