'use client'

//import Navbar from "@/components/Navbar/Navbar"; implemented later
import NavbarCompany from "@/components/Navbar/NavbarCompany";
import NotificationComment from "@/components/NotificationsMuni/NotificationComment";
import NotificationUpdate from "@/components/NotificationsMuni/NotificationUpdate";
import NotificationUpvote from "@/components/NotificationsMuni/NotificationUpvote";
import NotificationWatchlist from "@/components/NotificationsMuni/NotificationWatchlist";
import NotificationBid from "@/components/NotificationsMuni/NotificationBid";
import NotificationCreated from "@/components/NotificationsMuni/NotificationCreated";
import NotificationUrgent from "@/components/NotificationsMuni/NotificationUrgent";

export default function Notifications() {
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
            <h1 className="text-4xl font-bold mb-2 mt-2 ml-2 text-white text-opacity-80">Notifications</h1>
            <NotificationComment />
            <NotificationUpdate />
            <NotificationUpvote />
            <NotificationWatchlist />
            <NotificationBid />
            <NotificationCreated />
            <NotificationUrgent />
          </main>
        </div>
      );
}
