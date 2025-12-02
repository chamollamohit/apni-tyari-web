"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
    const [searchValue, setSearchValue] = useState("");
    const debouncedValue = useDebounce(searchValue);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    categoryId: currentCategoryId,
                    title: debouncedValue,
                },
            },
            { skipEmptyString: true, skipNull: true }
        );

        router.push(url);
    }, [debouncedValue, currentCategoryId, router, pathname]);

    return (
        <div className="relative">
            <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
            <Input
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 border-none focus-visible:ring-slate-200"
                placeholder="Search for a course..."
            />
        </div>
    );
};
