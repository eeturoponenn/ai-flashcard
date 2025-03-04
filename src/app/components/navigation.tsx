"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoginButton, LogoutButton } from "../auth";

export const Navigation = () =>{
    const pathname = usePathname();

    return(
        <nav className="flex items-center justify-between px-20">
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
                <LoginButton />
                <LogoutButton />
            </div>
        </nav>
    );
}