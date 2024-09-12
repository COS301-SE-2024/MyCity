"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";

export default function About() {
 
  return (
    <div className="h-screen w-screen">
      {/* Desktop View */}
      <div className="hidden sm:block h-full w-full">
        {/* Navbar */}
        <Navbar showLogin={true} />
        {/* Background Image */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            zIndex: -1,
          }}
        ></div>
        <main className="h-full">



        </main>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <Navbar />
        {/* Mobile content */}
        <MobileView />
      </div>
    </div>
  );
}

// Mobile View
function MobileView() {
  return (
    <div className="h-screen flex items-center justify-center text-center bg-gray-800 text-white">
      <div>
        <h1 className="text-4xl">Mobile View Coming Soon</h1>
        <p className="text-xl mt-4">
          Please use the desktop version for the full experience.
        </p>
      </div>
    </div>
  );
}
