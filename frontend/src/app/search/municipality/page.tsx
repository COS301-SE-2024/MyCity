'use client'

//import Navbar from "@/components/Navbar/Navbar"; implemented later
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";

export default function About() {
    return (
        <div>
            <NavbarMunicipality />
            <main>
                <div className="flex items-center justify-center">
                    <span className="text-[4rem]">Search</span>
                </div>
            </main>
        </div>
    );
}
