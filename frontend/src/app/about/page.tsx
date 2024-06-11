'use client'

import NavbarGuest from "@/components/Navbar/NavbarGuest";

export default function About() {
    return (
        <div>
            <NavbarGuest />
            <main>
                <div className="flex items-center justify-center">
                    <span className="text-[4rem]">About MyCity...</span>
                </div>
            </main>
        </div>
    );
}
