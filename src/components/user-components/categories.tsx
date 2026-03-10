"use client";

import { CourseCategory } from "@prisma/client";
import { Microscope, Atom, Globe, BookOpen, Lightbulb } from "lucide-react";
import { LucideIcon } from "lucide-react";

import { CategoryItem } from "./category-item";

interface CategoriesProps {
    items: {
        label: string;
        value: CourseCategory;
    }[];
}

const iconMap: Record<CourseCategory, LucideIcon> = {
    NEET: Microscope,
    JEE: Atom,
    UPSC: Globe,
    FOUNDATION: BookOpen,
};

export const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {items.map((item) => (
                <CategoryItem
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    icon={iconMap[item.value] || Lightbulb}
                />
            ))}
        </div>
    );
};
