'use client'

import Navbar from "@/components/Navbar/Navbar";

export default function About() {
    return (
        <div>
            <Navbar />
            <main>
                <div className="flex items-center justify-center">
                    <span className="text-[4rem]">About MyCity...</span>
                </div>
            </main>
        </div>
    );
}
