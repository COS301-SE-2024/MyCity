"use client";

import React, { useState, useEffect } from "react";
import CreateTicketComp from "@/components/CreateTicket/CreateTicketComp";
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import { FaTimes } from "react-icons/fa";
import { HelpCircle } from "lucide-react";

export default function CreateTicket() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const toggleHelpMenu = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  useEffect(() => {
    // Mock the unread notifications count with a random number
    const mockUnreadNotifications = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    setUnreadNotifications(mockUnreadNotifications);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0"
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
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          zIndex: -1,
        }}
      ></div>

      {/* Overlay to ensure content is on top of the background */}
      <div className="relative z-10">
        {/* Navbar */}
        <NavbarMunicipality unreadNotifications={unreadNotifications} />

        {isHelpOpen && (
          <div
            data-testid="help"
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
          >
            <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative">
              <button
                data-testid="close-help-menu"
                className="absolute top-2 right-2 text-gray-700"
                onClick={toggleHelpMenu}
              >
                <FaTimes size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4">Help Menu</h2>
              <p>This page allows you to:</p>
              <ul className="list-disc list-inside">
                <li>Submit a new ticket to report an issue in your area.</li>
                <li>
                  Provide details such as the location and description of the
                  issue.
                </li>
              </ul>
              <p>
                Use the map to pinpoint the exact location of the issue, and
                fill out the form with the necessary details.
              </p>
            </div>
          </div>
        )}

        {/* Desktop View */}
        <div className="hidden sm:block">
          <h1 className="text-4xl font-bold mb-3 text-white text-opacity-80 absolute ml-9 mt-5">
            Report an Issue
          </h1>
          <main className="flex flex-col items-center justify-start py-5">
            <div className="relative"></div>
            <div className="w-full max-w-7xl px-5">
              <div className="mt-20">
                <CreateTicketComp />
              </div>
            </div>
            {/* Help Menu Button */}
            <div className="fixed bottom-4 left-4 z-20">
              <HelpCircle
                data-testid="open-help-menu"
                className="text-white cursor-pointer transform transition-transform duration-300 hover:scale-110 z-20"
                size={24}
                onClick={toggleHelpMenu}
              />
            </div>
          </main>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden">
          <NavbarMobile />
          <main className="flex flex-col items-center justify-start py-5">
            <h1 className="text-4xl font-bold mb-3 text-white text-opacity-80 text-center mt-5">
              Report an Issue
            </h1>
            <div className="w-full max-w-7xl px-5">
              <div className="mt-10">
                <CreateTicketComp />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
