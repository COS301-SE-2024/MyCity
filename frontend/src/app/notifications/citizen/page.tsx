'use client';

import NavbarUser from "@/components/Navbar/NavbarUser";
import React, { Key, useEffect, useRef, useState } from "react";
import TicketNoti from "@/components/NotificationsCitizenNew/TicketNoti";
import { useProfile } from "@/hooks/useProfile";
import { ThreeDots } from "react-loader-spinner"; // Import the loading spinner

interface CardData {
  dateClosed: string;
  upvotes: number;
  ticket_id: string;
  ticketnumber: string;
  asset_id: string;
  state: string;
  dateOpened: string;
  createdby: string;
  imageURL: string;
  viewcount: number;
  description: string;
  municipality_id: string;
  commentcount: number;
  user_picture: string;
  address: string;
  latitude: number;
  longitude: number;
  urgency: "high" | "medium" | "low";
}

import {
  getTicket,
  getTicketsInMunicipality,
  getMostUpvote,
  getWatchlistTickets,
} from "@/services/tickets.service";

interface ScrollablePanelProps {
  title: string;
  children: React.ReactNode;
}

const ScrollablePanel: React.FC<ScrollablePanelProps> = ({
  title,
  children,
}) => (
  <div className="flex bg-white flex-col rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 h-[80vh] m-4 overflow-auto">
    <div className="flex justify-center border p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
    <div className="overflow-y-auto h-full overflow-auto">{children}</div>
  </div>
);

export default function Notifications() {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const userProfile = useProfile();
  const [dashMostUpvoteResults, setMostUpvoteResults] = useState<any[]>([]);
  const [dashMuniResults, setDashMuniResults] = useState<any[]>([]);
  const [dashWatchResults, setDashWatchResults] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 20;
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const handleCardClick = (cardData: CardData) => {
    setSelectedCard(cardData);
    setShowModal(true);
  };

  useEffect(() => {
    // Mock the unread notifications count with a random number
    const mockUnreadNotifications = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    setUnreadNotifications(mockUnreadNotifications);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_data = await userProfile.getUserProfile();
        const user_id = user_data.current?.email;
        const user_session = String(user_data.current?.session_token);

        const rspmostupvotes = await getMostUpvote(user_session);
        const rspwatchlist = await getWatchlistTickets(
          String(user_id),
          user_session
        );
        const municipality = user_data.current?.municipality;
        const rspmunicipality = await getTicketsInMunicipality(
          municipality,
          user_session
        );

        setMostUpvoteResults(rspmostupvotes);
        setDashMuniResults(
          Array.isArray(rspmunicipality) ? rspmunicipality : []
        );
        setDashWatchResults(Array.isArray(rspwatchlist) ? rspwatchlist : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [userProfile]);

  const showNextItems = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerPage, allTickets.length - itemsPerPage)
    );
  };

  const showPreviousItems = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  const allTickets = [
    ...dashMostUpvoteResults.map((ticket) => ({
      ...ticket,
      action: "upvoted",
    })),
    ...dashMuniResults.map((ticket) => ({ ...ticket, action: "commented on" })),
    ...dashWatchResults.map((ticket) => ({ ...ticket, action: "watchlisted" })),
  ];

  const visibleNotifications = allTickets
    .slice(startIndex, Math.min(startIndex + itemsPerPage, allTickets.length))
    .map((item, index) => {
      const action = dashMostUpvoteResults.includes(item)
        ? "upvoted"
        : dashWatchResults.includes(item)
        ? "watchlisted"
        : dashMuniResults.includes(item)
        ? "updated"
        : "commented on";

      return (
        <TicketNoti
          key={index}
          ticketNumber={item.ticketnumber}
          image={item.imageURL || null}
          action={action}
          isNew={item.isNew || false}
          title={item.title}
          address={item.address}
          description={item.description}
          createdBy={item.createdby}
          arrowCount={item.upvotes}
          commentCount={item.commentcount}
          viewCount={item.viewcount}
          latitude={item.latitude}
          longitude={item.longitude}
          urgency={item.urgency}
          ticket_id={item.ticket_id}
        />
      );
    });

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
          <NavbarUser unreadNotifications={unreadNotifications} />

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

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#ADD8E6"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
              ) : (
                <div className="pt-20 px-6 rounded-3xl">{visibleNotifications}</div>
              )}

              {/* Add other static TicketNoti components if needed */}
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
