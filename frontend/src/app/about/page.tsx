"use client";

import Navbar from "@/components/Navbar/Navbar";

export default function About() {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <Navbar />
          <main>
            <div className="flex items-center justify-center">
              <span className="text-[4rem]">About MyCity...</span>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden"></div>
    </div>
  );
}
