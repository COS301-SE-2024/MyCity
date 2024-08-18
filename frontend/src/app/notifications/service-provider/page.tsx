"use client";

import { useState } from "react";

//import Navbar from "@/components/Navbar/Navbar"; implemented later
import NavbarCompany from "@/components/Navbar/NavbarCompany";
import TicketNoti from "@/components/NotificationsCompanyNew/TicketNoti";
import TenderNoti from "@/components/NotificationsCompanyNew/TenderNoti";
import Comments from "@/components/Comments/comments";
export default function Notifications() {
  const handleDelete = () => {
    console.log("Delete notification");
  };
  const unreadNotifications = Math.floor(Math.random() * 10) + 1;
  
  return (
    <div>
      <NavbarCompany unreadNotifications={unreadNotifications} />
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
        <TicketNoti
          ticketNumber="12345"
          image="" // No image provided, so the profile icon will be shown
          action="upvoted"
          isNew={true} // New notification
        />
        <TicketNoti
          ticketNumber="67890"
          image="https://via.placeholder.com/150" // Image provided
          action="commented on"
          isNew={false} // Viewed notification
        />
        <TicketNoti
          ticketNumber="11223"
          image="" // No image provided, so the profile icon will be shown
          action="watchlisted"
          isNew={true} // New notification
        />
        <TicketNoti
          ticketNumber="44556"
          image="https://via.placeholder.com/150" // Image provided
          action="updated status to:"
          isNew={false} // Viewed notification
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
        image={null} // No image provided
        action="contract terminated"
        isNew={true}
      />
      <TenderNoti
        tenderId="09876"
        image="https://via.placeholder.com/50"
        action="contract completed"
        isNew={false}
      />
      </main>
    </div>
  );
}
