"use client";

import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import NotificationComment from "@/components/NotificationsCitizen/NotificationComment";
import NotificationUpdate from "@/components/NotificationsCitizen/NotificationUpdate";
import NotificationUpvote from "@/components/NotificationsCitizen/NotificationUpvote";
import NotificationWatchlist from "@/components/NotificationsCitizen/NotificationWatchlist";
export default function Noticfications() {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <Navbar />
          <div
            style={{
              position: "fixed", // Change position to 'fixed'
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed", // Ensures the background is fixed regardless of scrolling
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>
          <main>
            <h1 className="text-4xl font-bold mb-2 mt-2 ml-2 text-white text-opacity-80">
              Notifications
            </h1>
            <NotificationComment />
            <NotificationUpdate />
            <NotificationUpvote />
            <NotificationWatchlist />
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden"></div>
    </div>
  );
}
