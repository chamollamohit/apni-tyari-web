"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangeFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Reading Initial State from URL
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: fromParam ? new Date(fromParam) : new Date(), // Default: Today
        to: toParam ? new Date(toParam) : addDays(new Date(), 6), // Default: +6 Days
    });

    // Updating URL when date changes
    const onSelect = (range: DateRange | undefined) => {
        setDate(range);

        // Only push to URL if we have both dates or cleared it
        if (range?.from && range?.to) {
            const current = new URLSearchParams(
                Array.from(searchParams.entries())
            );

            current.set("from", format(range.from, "yyyy-MM-dd"));
            current.set("to", format(range.to, "yyyy-MM-dd"));
            router.push(`${pathname}?${current.toString()}`);
        } else if (!range) {
            // Clear filter
            const current = new URLSearchParams(
                Array.from(searchParams.entries())
            );
            current.delete("from");
            current.delete("to");
            router.push(`${pathname}?${current.toString()}`);
        }
    };

    // Helper to clear filter manually
    const onClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDate(undefined);
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.delete("from");
        current.delete("to");
        router.push(`${pathname}?${current.toString()}`);
    };

    return (
        <div className="grid gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[260px] justify-start text-left font-normal border-slate-300",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}

                        {/* Clear Button */}
                        {date?.from && (
                            <div
                                className="ml-auto hover:bg-slate-200 rounded-full p-1"
                                onClick={onClear}
                            >
                                <X className="h-3 w-3 text-slate-500" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={onSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
