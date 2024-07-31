"use client";

import { useState } from "react";

//import Navbar from "@/components/Navbar/Navbar"; implemented later
import NavbarCompany from "@/components/Navbar/NavbarCompany";
import CommentComponent from "@/components/NotificationsCompany/NotificationComment";
import CreatedComponent from "@/components/NotificationsCompany/NotificationCreated";
import UpdateComponent from "@/components/NotificationsCompany/NotificationUpdate";
import UpvoteComponent from "@/components/NotificationsCompany/NotificationUpvote";
import WatchlistComponent from "@/components/NotificationsCompany/NotificationWatchlist";
export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { name: 'Kyle Marshall', seen: false },
    { name: 'Benson Boone', seen: true },
  ]);

  const handleDelete = () => {
    console.log("Delete notification");
  };
  return (
    <div>
      <NavbarCompany />
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
        <CommentComponent seen={false} />
        <UpdateComponent
          municipality="City of Ekurhuleni"
          action="accepted"
          seen={true}
          onDelete={handleDelete}
        />
        <UpdateComponent
          municipality="City of Ekurhuleni"
          action="rejected"
          seen={false}
          onDelete={handleDelete}
        />
        <UpvoteComponent
          name="Kyle Marshall"
          seen={true}
          onDelete={handleDelete}
        />
        <WatchlistComponent seen={false} />
        <CreatedComponent seen={false} />
      </main>
    </div>
  );
}
