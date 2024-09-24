"use client"

import { useState } from "react";
import NavbarCompany from "@/components/Navbar/NavbarCompany";
import TicketNoti from "@/components/NotificationsCompanyNew/TicketNoti";
import TenderNoti from "@/components/NotificationsCompanyNew/TenderNoti";
import NavbarMobile from "@/components/Navbar/NavbarMobile";

export default function Notifications() {
  const handleDelete = () => {
    console.log("Delete notification");
  };
  const unreadNotifications = Math.floor(Math.random() * 10) + 1;

  return (
    <div>
      {/* Navbar */}
      <NavbarCompany unreadNotifications={unreadNotifications} />

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
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      ></div>

      <main>
        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="relative pt-8">
            <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
              Notifications
            </h1>
          </div>
          <div className="pt-20 px-6 rounded-3xl">
            <TicketNoti
              ticketNumber="12345"
              image={null}
              action="upvoted"
              isNew={true}
            />
            <TicketNoti
              ticketNumber="67890"
              image={null}
              action="commented on"
              isNew={false}
            />
            <TicketNoti
              ticketNumber="11223"
              image=""
              action="watchlisted"
              isNew={true}
            />
            <TicketNoti
              ticketNumber="44556"
              image=""
              action="updated status to:"
              isNew={false}
            />
            <TenderNoti
              tenderId="12345"
              image=""
              action="bid accepted"
              isNew={true}
            />
            <TenderNoti
              tenderId="67890"
              image=""
              action="bid rejected"
              isNew={false}
            />
            <TenderNoti
              tenderId="54321"
              image={null}
              action="contract terminated"
              isNew={true}
            />
            <TenderNoti
              tenderId="09876"
              image=''
              action="contract completed"
              isNew={false}
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden">
          <NavbarMobile />
          <div className="relative">
          <h1 className="text-3xl font-bold text-white text-opacity-80 text-center mt-2">
              Notifications
            </h1>
          </div>
          <div className="pt-6 mb-24">
            <TicketNoti
              ticketNumber="12345"
              image=""
              action="upvoted"
              isNew={true}
            />
            <TicketNoti
              ticketNumber="67890"
              image="https://via.placeholder.com/150"
              action="commented on"
              isNew={false}
            />
            <TicketNoti
              ticketNumber="11223"
              image=""
              action="watchlisted"
              isNew={true}
            />
            <TicketNoti
              ticketNumber="44556"
              image="https://via.placeholder.com/150"
              action="updated status to:"
              isNew={false}
            />
            <TenderNoti
              tenderId="12345"
              image="https://via.placeholder.com/50"
              action="bid accepted"
              isNew={true}
            />
            <TenderNoti
              tenderId="67890"
              image="https://via.placeholder.com/50"
              action="bid rejected"
              isNew={false}
            />
            <TenderNoti
              tenderId="54321"
              image={null}
              action="contract terminated"
              isNew={true}
            />
            <TenderNoti
              tenderId="09876"
              image="https://via.placeholder.com/50"
              action="contract completed"
              isNew={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
