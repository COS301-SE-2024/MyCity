"use client";

//import Navbar from "@/components/Navbar/Navbar"; implemented later
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";

export default function About() {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <NavbarMunicipality />
          <main>
            <div className="flex items-center justify-center">
              <span className="text-[4rem]">Settings</span>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden"></div>
    </div>
  );
}
