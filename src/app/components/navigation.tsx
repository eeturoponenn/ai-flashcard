"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoginButton, LogoutButton } from "../auth";
import { User } from "lucide-react";

export const Navigation = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="text-2xl font-bold">
                <Link href="/">AI Muistikortit</Link>
            </div>
            <div className="flex space-x-6">
                <Link href="/" className={pathname === "/" ? "font-bold mr-4" : "text-blue-500 mr-4"}>
                    Koti
                </Link>
                <Link href="/decks" className={pathname === "/decks" ? "font-bold mr-4" : "text-blue-500 mr-4"}>
                    Pakat
                </Link>
            </div>
            <div className="flex space-x-4">
                {session?.user?.id && (
                    <Link
                        href={`/profile/${session.user.id}`}
                        className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition"
                        title="Profiili"
                    >
                        <User className="w-5 h-5 text-blue-700" />
                    </Link>
                )}
                <LoginButton />
                <LogoutButton />
            </div>
        </nav>
    );
}