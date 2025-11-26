"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
export const Navbar = () => {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <div className="p-4 border-b h-16 flex items-center justify-between bg-white shadow-sm fixed top-0 w-full z-50">
            {/* LOGO */}
            <Link href="/" className="font-bold text-xl text-blue-600">
                EdTech Platform
            </Link>

            {/* ACTIONS */}
            <div>
                {!session ? (
                    // FLOW 1: GUEST
                    <Link href="/login">
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                            Sign In
                        </button>
                    </Link>
                ) : (
                    // FLOW 2 & 3: LOGGED IN (Student or Admin)
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 focus:outline-none"
                        >
                            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200">
                                {/* Show Google Image or fallback initial */}
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt="User"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {session.user?.name?.[0]}
                                    </div>
                                )}
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm font-semibold">
                                        {session.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {session.user?.email}
                                    </p>
                                </div>

                                {/* Admin Link (Only visible if Admin) */}
                                {session.user?.role === "ADMIN" && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 text-blue-600 font-medium"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={() =>
                                        signOut({ callbackUrl: "/" })
                                    }
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
