"use client";

import React, { useState } from "react";
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import TicketNoti from "@/components/NotificationsMuniNew/TicketNoti";
import Alert from "@/components/NotificationsMuniNew/Alert";
import TenderNoti from "@/components/NotificationsMuniNew/TenderNoti";

export default function Notifications() {
  const notifications = [
    {
      ticketNumber: "12345",
      image: "",
      action: "upvoted",
      isNew: true,
    },
    {
      ticketNumber: "12346",
      image: "",
      action: "commented on",
      isNew: false,
    },
    {
      ticketNumber: "12347",
      image: "",
      action: "watchlisted",
      isNew: true,
    },
    {
      ticketNumber: "12348",
      image: "",
      action: "updated status to:",
      isNew: false,
    },
  ];
  const alerts = [
    {
      message: "this ticket has 25 upvotes.",
      ticketId: "TCKT-001",
      isNew: true,
      ticketNumber: "328",
    },
  ];
  const unreadNotifications = Math.floor(Math.random() * 10) + 1;

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <NavbarMunicipality unreadNotifications={unreadNotifications} />

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
              zIndex: -1,
            }}
          />

          {/* Content */}
          <div className="fixed inset-0 overflow-y-auto">
            <main>
              <div className="relative pt-8">
                <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
                  Notifications
                </h1>
              </div>
              <div className="pt-20 px-6 rounded-3xl">
                {notifications.map((notification, index) => (
                  <TicketNoti
                    key={index}
                    ticketNumber={notification.ticketNumber}
                    image={notification.image}
                    action={notification.action}
                    isNew={notification.isNew}
                  />
                ))}

                <TenderNoti
                  tenderId="TND-001"
                  image=""
                  action="bid received"
                  isNew={true}
                />
                <TenderNoti
                  tenderId="TND-002"
                  image=""
                  action="completion report received"
                  isNew={true}
                />
                <Alert alerts={alerts} />
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <div className="text-white font-bold ms-2 transform hover:scale-105 mt-5 ml-5 transition-transform duration-200">
            <img
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-128.webp"
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
              zIndex: -1,
            }}
          />

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10">
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
