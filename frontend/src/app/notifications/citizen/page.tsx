"use client";

import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import NotificationComment from "@/components/NotificationsCitizen/NotificationComment";
import NotificationUpdate from "@/components/NotificationsCitizen/NotificationUpdate";
import NotificationUpvote from "@/components/NotificationsCitizen/NotificationUpvote";
import NotificationWatchlist from "@/components/NotificationsCitizen/NotificationWatchlist";
import NotificationPromt from "@/components/Notifications/NotificationPromt";
import {
  ChakraProvider,
  Container,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  theme,
  DarkMode,
} from "@chakra-ui/react";

export default function Notifications() {
  return (
    <div>
      {/* <NotificationPromt /> */}
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          {/* <Navbar /> */}
          <div
            style={{
              position: "relative",
              height: "100vh",
              overflow: "hidden", // Prevents content overflow
            }}
          >
            <Navbar />
          </div>

          {/* Background image */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1, // Ensures the background is behind other content
            }}
          >
            {/* Content */}
            <div className="h-[2vh] flex items-center justify-center"></div>
            <div>
              <main className="h-screen flex justify-center">
                {/* Your Ticket Interations */}
                <div className="flex bg-white flex-col rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit pb-4 pt-4 m-4">
                  <div className="flex justify-center border p-4">
                    <h1>Your Ticket Interations</h1>
                  </div>
                  <div className="my-2 mx-4">
                    <NotificationComment />
                  </div>

                  <div className="my-2 mx-4">
                    <NotificationUpvote />
                  </div>
                  <div className="my-2 mx-4">
                    <NotificationComment />
                  </div>

                  <div className="my-2 mx-4">
                    <NotificationUpvote />
                  </div>

                  <div className="my-2 mx-4">
                    <NotificationComment />
                  </div>

                  <div className="my-2 mx-4">
                    <NotificationUpvote />
                  </div>
                </div>

                {/* Your Ticket Interations */}
                <div className="flex bg-white flex-col rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit pb-4 m-4">
                  <div className="flex justify-center border p-4">
                    <h1>Your Ticket Updates</h1>
                  </div>
                  <div className="my-2 mx-4">
                    <NotificationUpdate />
                  </div>

                  <div className="m-4">
                    <NotificationUpdate />
                  </div>
                  <div className="m-4">
                    <NotificationUpdate />
                  </div>

                  <div className="m-4">
                    <NotificationUpdate />
                  </div>

                  <div className="m-4">
                    <NotificationUpdate />
                  </div>

                  <div className="m-4">
                    <NotificationUpdate />
                  </div>
                </div>

                {/* Your Watchlist */}
                <div className="flex bg-white flex-col rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit pb-4 pt-4 m-4">
                  <div className="flex justify-center border p-4">
                    <h1>Your Watchlist</h1>
                  </div>
                  <div className="my-2 mx-4">
                    <NotificationWatchlist />
                  </div>

                  <div className="my-2 mx-4">
                    <NotificationWatchlist />
                  </div>
                  <div className="my-2 mx-4">
                    <NotificationWatchlist />
                  </div>

                  <div className="my-2 mx-4">
                    <NotificationWatchlist />
                  </div>

                </div>
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden", // Prevents content overflow
          }}
        >
          <div className="text-white font-bold ms-2 transform hover:scale-105 mt-5 ml-5 transition-transform duration-200">
            <img
              src="https://i.imgur.com/WbMLivx.png"
              alt="MyCity"
              width={100}
              height={100}
              className="w-100 h-100"
            />
          </div>

          {/* Background image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10">
            {" "}
            {/* Ensure content is above the background */}
            <h1 className="text-4xl text-white font-bold mb-4 ml-4">
              <span className="text-blue-200">MyCity</span> <br />
              Under Construction
            </h1>
            <div className="text-white font-bold transform hover:scale-105 transition-transform duration-200 flex justify-center">
              <img
                src="https://i.imgur.com/eGeTTuo.png"
                alt="Under-Construction"
                width={300}
                height={300}
              />
            </div>
            <p className="text-lg text-gray-200 mb-4 ml-4">
              Our Mobile site is currently under construction.
              <br />
              Please use our Desktop site while we
              <br />
              work on it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
