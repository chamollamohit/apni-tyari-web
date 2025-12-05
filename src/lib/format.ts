export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(price);
};

export const formatIST = (date: Date | string) => {
    return new Date(date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        month: "short", // "Dec"
        day: "numeric", // "05"
        year: "numeric", // "2025"
        hour: "2-digit", // "05"
        minute: "2-digit", // "30"
        hour12: true, // "PM"
    });
};
