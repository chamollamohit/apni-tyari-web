import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // 1. Set a timer to update the value after (delay)ms
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay || 500);

        // 2. Cleanup function
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
