"use client";

import React, { Key, useEffect, useRef, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import FaultTable from "@/components/FaultTable/FaultTable";
import FaultMapView from "@/components/FaultMapView/FaultMapView";
import NavbarUser from "@/components/Navbar/NavbarUser";
import { FaTimes } from "react-icons/fa";
import { HelpCircle } from "lucide-react";
import DashboardFaultCardContainer from "@/components/FaultCardContainer/DashboardFualtCardContainer";
import { useProfile } from "@/hooks/useProfile";
import { ThreeDots } from "react-loader-spinner";
import {
  getMostUpvote,
  getTicketsInMunicipality,
  getWatchlistTickets,
} from "@/services/tickets.service";

export default function CitizenDashboard() {
  const user = useRef(null);
  const userProfile = useProfile();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [dashMostUpvoteResults, setMostUpvoteResults] = useState<any[]>([]);
  const [dashMuniResults, setDashMuniResults] = useState<any[]>([]);
  const [dashWatchResults, setDashWatchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

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

        // Preload images for all the fetched results
        const imagesToPreload = [
          ...rspmostupvotes,
          ...rspwatchlist,
          ...rspmunicipality,
        ].map((item) => item.image);

        preloadImages(imagesToPreload);

        setMostUpvoteResults(rspmostupvotes);
        setDashMuniResults(
          Array.isArray(rspmunicipality) ? rspmunicipality : []
        );
        setDashWatchResults(rspwatchlist.length > 0 ? rspwatchlist : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userProfile]);

  const preloadImages = (srcs: string[]) => {
    srcs.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  };

  const handleTabChange = (key: Key) => {
    const index = Number(key);
  };

  const toggleHelpMenu = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex justify-center mt-5">
          {/* <NotificationPromt /> */}
        </div>
        <div>
          <NavbarUser unreadNotifications={unreadNotifications} />

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
              backgroundAttachment: "fixed",
              zIndex: -1,
            }}
          ></div>
          <main>
            <div className="relative">
              <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
                Dashboard
              </h1>
            </div>

            <div className="fixed bottom-4 left-4 z-20">
              <HelpCircle
                data-testid="open-help-menu"
                className="text-white cursor-pointer transform transition-transform duration-300 hover:scale-110 z-20"
                size={24}
                onClick={toggleHelpMenu}
              />
            </div>

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
                  <p>This dashboard allows you to:</p>
                  <ul className="list-disc list-inside">
                    <li>View the most up-voted issues in your area.</li>
                    <li>See issues nearest to your location.</li>
                    <li>Track issues you have added to your watchlist.</li>
                    <li>
                      Switch between different views: Cards, List, and Map.
                    </li>
                  </ul>
                  <p>
                    Use the tabs to navigate between different sections of the
                    dashboard.
                  </p>
                </div>
              </div>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full fixed bottom-4 right-4 shadow-lg z-20"
              onClick={() => (window.location.href = "/create-ticket/citizen")}
            >
              + New Ticket
            </button>
            <div className="flex flex-col items-center justify-center rounded-lg h-fit py-1">
              <Tabs
                aria-label="Signup Options"
                defaultSelectedKey={0}
                className="mt-5 flex justify-center w-full"
                classNames={{
                  tab: "min-w-32 min-h-10 bg-white bg-opacity-30 text-black",
                  panel: "w-full",
                  cursor: "w-full border-3 border-blue-700/40",
                  tabContent:
                    "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md group-data-[selected=true]:bg-white group-data-[selected=true]:bg-opacity-60 group-data-[selected=true]:text-black",
                }}
                onSelectionChange={handleTabChange}
              >
                <Tab key={0} title="Cards">
                  <div className="w-full text-center">
                    <h1 className="text-2xl text-white text-opacity-80 font-bold mt-2">
                      Most up-voted
                    </h1>
                  </div>
                  <div className="w-full text-center">
                    <h1 className="text-l text-white text-opacity-80 mb-4">
                      Based on votes from the community in your area.
                    </h1>
                  </div>
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  ) : dashMostUpvoteResults.length > 0 ? (
                    <DashboardFaultCardContainer
                      cardData={dashMostUpvoteResults}
                    />
                  ) : (
                    <p className="text-center text-white text-opacity-60 text-sm">
                      There are no faults to display.
                    </p>
                  )}

                  <h1 className="text-2xl text-center text-white text-opacity-80 font-bold mt-2 ml-2">
                    Nearest to you
                  </h1>
                  <h1 className="text-center text-white mb-4 ml-2">
                    Based on your proximity to the issue.
                  </h1>

                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  ) : dashMuniResults.length > 0 ? (
                    <DashboardFaultCardContainer cardData={dashMuniResults} />
                  ) : (
                    <p className="text-center text-sm text-opacity-60 text-white">
                      There are no faults to display.
                    </p>
                  )}

                  <h1 className="text-2xl text-white text-opacity-80 text-center font-bold mt-2 ml-2">
                    Watchlist
                  </h1>

                  <h1 className="text-l text-opacity-80 text-white text-center mb-4 ml-2">
                    All of the issues you have added to your watchlist.
                  </h1>

                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  ) : dashWatchResults.length > 0 ? (
                    <DashboardFaultCardContainer cardData={dashWatchResults} />
                  ) : (
                    <p className="text-center text-white text-opacity-60 text-sm">
                      There are no faults to display.
                    </p>
                  )}
                </Tab>

                <Tab key={1} title="List">
                  <FaultTable tableitems={dashMostUpvoteResults} />
                </Tab>

                <Tab key={2} title="Map">
                  <h1 className="text-3xl font-bold mb-4 mt-2 ml-2 text-center text-white text-opacity-70">
                    Faults Near You
                  </h1>
                  <FaultMapView />
                </Tab>
              </Tabs>
            </div>
          </main>
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
          ></div>

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10">
            {" "}
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
