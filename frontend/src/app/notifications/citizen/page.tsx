"use client";

import NavbarUser from "@/components/Navbar/NavbarUser";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
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
import { PaginatedResults } from "@/types/custom.types";

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
  const [dashMostUpvoteResults, setMostUpvoteResults] = useState<PaginatedResults>({ lastEvaluatedKey: null, items: [] });
  const [dashMuniResults, setDashMuniResults] = useState<PaginatedResults>({ lastEvaluatedKey: null, items: [] });
  const [dashWatchResults, setDashWatchResults] = useState<PaginatedResults>({ lastEvaluatedKey: null, items: [] });
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 20;
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const refreshwatchlist = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_id = user_data.current?.email ?? "";
      const user_session = String(user_data.current?.session_token);
      const rspwatchlist = await getWatchlistTickets(
        String(user_id),
        user_session,
        true
      );
      setDashWatchResults(rspwatchlist);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (cardData: CardData) => {
    setSelectedCard(cardData);
    setShowModal(true);
  };

  useEffect(() => {
    // Mock the unread notifications count with a random number
    const mockUnreadNotifications = 81; // Random number between 1 and 10
    setUnreadNotifications(mockUnreadNotifications);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_data = await userProfile.getUserProfile();
        const user_id = user_data.current?.email ?? "";
        const user_session = String(user_data.current?.session_token);
        const user_email = String(user_id).toLowerCase();
        const municipality = user_data.current?.municipality;

        const promises = [
          getWatchlistTickets(user_email, user_session),
          getMostUpvote(user_session),
          getTicketsInMunicipality(municipality, user_session),
        ];

        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            if (index === 0) {
              setDashWatchResults(result.value);
            } else if (index === 1) {
              setMostUpvoteResults(result.value);
            } else if (index === 2) {
              setDashMuniResults(result.value);
            }
          }
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
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
    ...dashMostUpvoteResults.items.map((ticket) => ({
      ...ticket,
      action: "upvoted",
    })),
    ...dashMuniResults.items.map((ticket) => ({ ...ticket, action: "commented on" })),
    ...dashWatchResults.items.map((ticket) => ({ ...ticket, action: "watchlisted" })),
  ];

  const visibleNotifications = allTickets
    .slice(startIndex, Math.min(startIndex + itemsPerPage, allTickets.length))
    .map((item, index) => {
      const action = dashMostUpvoteResults.items.includes(item)
        ? "upvoted"
        : dashWatchResults.items.includes(item)
          ? "watchlisted"
          : dashMuniResults.items.includes(item)
            ? "updated"
            : "commented on";

      return (
        <div
          className="flex w-full h-[10%] my-2 justify-center"
          key={item.ticket_id}
        >
          <TicketNoti
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
            state={item.state}
            municipality_id={item.municipality_id}
            refreshwatch={refreshwatchlist}
          />
        </div>
      );
    });

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        {/* Adjusted z-index to ensure the navbar is on top */}
        <div className="z-[1000] relative">
          <NavbarUser unreadNotifications={unreadNotifications} />
        </div>

        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Background image */}
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
              zIndex: -1, // Keep this behind the content
            }}
          />

          {/* Inline scrollbar styles */}
          <style jsx>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #6b7280;
        border-radius: 4px;
        border: 2px solid transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #4b5563;
      }
    `}</style>

          {/* Content */}
          <div className="fixed w-full h-full inset-0 z-[5]"> {/* Added z-index */}
            <main className="flex w-full h-full">
              <div className="relative pt-8">
                <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
                  Notifications
                </h1>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center fixed inset-0">
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
                <div className="flex w-full justify-center items-center overflow-hidden">
                  <div className="pt-4 rounded-3xl w-[80%] h-[75%] justify-center">
                    <div
                      className="px-6 rounded-3xl justify-center items-center w-full h-full overflow-y-auto custom-scrollbar"
                      style={{
                        scrollbarWidth: "thin", // For Firefox
                        scrollbarColor: "#6b7280 rgba(255, 255, 255, 0.2)", // For Firefox
                      }}
                    >
                      {visibleNotifications}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>


      {/* Mobile View */}
      <div className="block sm:hidden">
        <NavbarUser unreadNotifications={unreadNotifications} />
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Mobile Navbar */}
          <NavbarMobile />

          {/* Background image */}
          <div
            style={{
              position: "absolute",
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
          />

          {/* Content */}
          <div className="fixed inset-0 overflow-y-auto pt-4">
            {" "}
            {/* Reduced padding further to pt-4 */}
            <h1 className="text-3xl font-bold text-white text-opacity-80 text-center mt-2">
              Notifications
            </h1>
            <main>
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
                <div className="px-2 mt-2">{visibleNotifications}</div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
