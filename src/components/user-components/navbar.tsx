"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LogOut,
    LayoutDashboard,
    User,
    Menu,
    X,
    BookOpen,
    GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";

export const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const routes = [
        { label: "Browse Courses", href: "/search" },
        { label: "My Learning", href: "/dashboard", protected: true },
    ];

    return (
        <nav className="sticky top-0 w-full z-50 bg-white border-b border-slate-200 h-16  inset-y-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 group"
                        >
                            <div className="hidden md:block relative h-15 w-50">
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
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-6">
                            {routes.map((route) => {
                                if (route.protected && !user) return null;
                                const isActive = pathname === route.href;

                                return (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        className={cn(
                                            "text-sm font-medium transition-colors hover:text-black",
                                            isActive
                                                ? "text-black"
                                                : "text-slate-500"
                                        )}
                                    >
                                        {route.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: Auth Actions */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-slate-500"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            {!user ? (
                                <div className="flex items-center gap-2">
                                    <Link href="/login">
                                        <Button
                                            variant="ghost"
                                            className="text-slate-600"
                                        >
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button className="bg-black text-white hover:bg-slate-800">
                                            Sign up
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    {/* Admin Mode */}
                                    {user.role === "ADMIN" && (
                                        <Link href="/admin/dashboard">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-slate-300"
                                            >
                                                Admin Mode
                                            </Button>
                                        </Link>
                                    )}

                                    {/* Profile Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="focus:outline-none">
                                            <Avatar className="h-8 w-8 border border-slate-200 cursor-pointer hover:opacity-90 transition">
                                                <AvatarImage
                                                    src={user.image || ""}
                                                />
                                                <AvatarFallback className="bg-slate-900 text-white font-bold text-xs">
                                                    {user.name?.[0]?.toUpperCase() ||
                                                        "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-56 mt-2"
                                        >
                                            <DropdownMenuLabel>
                                                <p className="font-normal text-xs text-slate-500">
                                                    Signed in as
                                                </p>
                                                <p className="font-bold text-sm truncate">
                                                    {user.email}
                                                </p>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <Link href="/dashboard">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                                    My Learning
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    signOut({
                                                        callbackUrl: "/",
                                                    })
                                                }
                                                className="text-red-600 focus:text-red-600 cursor-pointer focus:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Log out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white absolute w-full left-0 shadow-lg max-h-[80vh] overflow-y-auto">
                    {/* 1. Mobile User Profile Header */}
                    {user && (
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-slate-200">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="bg-slate-900 text-white font-bold">
                                    {user.name?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-semibold text-sm truncate text-slate-900">
                                    {user.name}
                                </span>
                                <span className="text-xs text-slate-500 truncate">
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="p-2 space-y-1">
                        {/* 2. Navigation Links */}
                        {routes.map((route) => {
                            if (route.protected && !user) return null;
                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md"
                                >
                                    {route.label === "Browse" && (
                                        <BookOpen className="h-4 w-4" />
                                    )}
                                    {route.label === "My Learning" && (
                                        <LayoutDashboard className="h-4 w-4" />
                                    )}
                                    {route.label}
                                </Link>
                            );
                        })}

                        {/* 3. Admin Mode (Mobile) */}
                        {user?.role === "ADMIN" && (
                            <Link
                                href="/admin/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md mt-2"
                            >
                                <GraduationCap className="h-4 w-4" />
                                Admin Dashboard
                            </Link>
                        )}

                        {/* 4. Auth Buttons */}
                        {user ? (
                            <>
                                <Separator className="my-2" />

                                <button
                                    onClick={() =>
                                        signOut({ callbackUrl: "/" })
                                    }
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md text-left"
                                >
                                    <LogOut className="h-4 w-4" /> Log out
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 mt-4 p-2">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Log in
                                    </Button>
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Button className="w-full bg-black text-white">
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
