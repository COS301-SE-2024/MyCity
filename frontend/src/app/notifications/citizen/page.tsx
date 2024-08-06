"use client";

import Navbar from "@/components/Navbar/Navbar";
import React, {useEffect, useRef, useState } from "react";
import DashboardNotificationsCardContainer from "@/components/NotificationsCardContainer/DashboardNotificationsCardContainer";
import { useProfile } from "@/hooks/useProfile";

import {
  getWatchlistTickets,
} from "@/services/tickets.service";



export const mockWatchlist = [
  {
    dateClosed: "",
    upvotes: 9.0,
    ticket_id: "f5e97ab9-c4c4-4115-93c5-933fb0660a8a",
    address:
      "Umzumbe Ward 12, Ugu District Municipality, Umzumbe Local Municipality, KwaZulu-Natal",
    asset_id: "Park equipment maintenance",
    state: "In Progress",
    dateOpened: "2024-04-05T09:18:00",
    imageURL:
      "https://media.istockphoto.com/id/1329935249/photo/old-swings-abandoned-playground-equipment-on-the-background-of-swings-and-carousels.jpg?s=612x612&w=0&k=20&c=b75a7nquAomAUowIorleQTF3-z5QnPfWsuD0wvqsA_E=",
    viewcount: 30.0,
    longitude: "30.4233950524851",
    username: "ethan.clark@telkomsa.net",
    description: "This Park equipment maintenance problem is a safety hazard.",
    latitude: "-30.4659199",
    municipality_id: "Umzumbe Local",
    commentcount: 3,
    user_picture: "https://i.imgur.com/4CZCyPM.png",
    createdby: "Ethan",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Umzumbe_Local.png",
  },
  {
    dateClosed: "",
    upvotes: 9.0,
    ticket_id: "b3f9f49e-c894-4832-be28-5e0bbb16aeb3",
    address:
      "Umzumbe Ward 12, Ugu District Municipality, Umzumbe Local Municipality, KwaZulu-Natal",
    asset_id: "Vandalized bus stops",
    state: "Opened",
    dateOpened: "2024-04-20T17:58:00",
    imageURL:
      "https://lh3.googleusercontent.com/lWTkgY7Me1FOvsOrVdWxwn4_KbL7dNfIK6Pvtp_wkg-uIhn3ZkX1KxJhsc_2NrQn9EsrFVrnL2cgsDMnVQvl=s1051",
    viewcount: 29.0,
    longitude: "30.4233950524851",
    username: "niki.makris@live.com",
    description: "New Vandalized bus stops problem here.",
    latitude: "-30.4859199",
    municipality_id: "Umzumbe Local",
    commentcount: 3,
    user_picture: "https://i.imgur.com/xKEKm62.png",
    createdby: "Niki",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Umzumbe_Local.png",
  },
  {
    dateClosed: "",
    upvotes: 4.0,
    ticket_id: "5fee334d-ecc9-48c7-9399-fad622e42fdb",
    address:
      "Umzumbe Ward 7, Ugu District Municipality, Umzumbe Local Municipality, KwaZulu-Natal",
    asset_id: "Damaged fire hydrants",
    state: "Assigning Contract",
    dateOpened: "2024-04-18T15:45:00",
    imageURL:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6RroVo8cseVUTMqm7p2J0LnJmQ20ZFhTSbA&s",
    viewcount: 25.0,
    longitude: "30.3033950524851",
    username: "francois.jordaan@mimecast.com",
    description: "This Damaged fire hydrants problem needs to be fixed.",
    latitude: "-30.3959199",
    municipality_id: "Umzumbe Local",
    commentcount: 3,
    user_picture: "https://i.imgur.com/xKEKm62.png",
    createdby: "Francois",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Umzumbe_Local.png",
  },
  {
    dateClosed: "2024-04-09T08:31:00",
    upvotes: 9.0,
    ticket_id: "3486f609-ecb2-4289-b7e1-5e373e939b96",
    address:
      "D150, Ugu District Municipality, Hibiscus Coast Local Municipality, KwaZulu-Natal",
    asset_id: "Bridge maintenance",
    state: "Closed",
    dateOpened: "2024-04-07T16:46:00",
    imageURL:
      "https://t4.ftcdn.net/jpg/01/80/25/51/360_F_180255112_O1dUOvcA0kNqR9BM7cHDEkX6sJ41mC90.jpg",
    viewcount: 28.0,
    longitude: "30.4233950524851",
    username: "petro.kruger@gmail.com",
    description: "Fix this Bridge maintenance problem.",
    latitude: "-30.5759199",
    municipality_id: "Umzumbe Local",
    commentcount: 3,
    user_picture: "https://i.imgur.com/eQ2LFOY.png",
    createdby: "Petro",
    municipality_picture:
      "https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Umzumbe_Local.png",
  },
];

export default function Notifications() {
  const userProfile = useProfile();
  const [dashWatchResults, setDashWatchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user_data = await userProfile.getUserProfile();
      const user_id = user_data.current?.email;
      const user_session = String(user_data.current?.session_token);


      // const rspwatchlist = await getWatchlistTickets(
      //   String(user_id),
      //   user_session
      // );

      // const flattenedWatchlist = rspwatchlist.flat();
      // if (rspwatchlist.length > 0) {
      //   setDashWatchResults(rspwatchlist);
      //   console.log(dashWatchResults);
      // } else setDashWatchResults(mockWatchlist);

      setDashWatchResults(mockWatchlist);
    };

    fetchData();
  }, [userProfile]); // Add userProfile to the dependency array

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
          <Navbar />
          {/* <NotificationPromt /> */}

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
          <div className="fixed inset-0 overflow-hidden">
            <main className="h-full flex items-center justify-center pb-16 overflow-auto">
              {/* Your Ticket Interactions */}
              <DashboardNotificationsCardContainer cardData={dashWatchResults} />
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
