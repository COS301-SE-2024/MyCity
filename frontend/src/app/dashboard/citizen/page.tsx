"use client";

import React, { Key, useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import FaultTable from "@/components/FaultTable/FaultTable";
import FaultMapView from "@/components/FaultMapView/FaultMapView";
import NavbarUser from "@/components/Navbar/NavbarUser";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import { FaTimes } from "react-icons/fa";
import { HelpCircle } from "lucide-react";
import DashboardFaultCardContainer from "@/components/FaultCardContainer/DashboardFualtCardContainer";
import { useProfile } from "@/hooks/useProfile";
import { ThreeDots } from "react-loader-spinner";
import LocationPrompt from "@/components/Location/LocationPrompt";
import {
  getMostUpvote,
  getTicket,
  getTicketsInMunicipality,
  getWatchlistTickets,
} from "@/services/tickets.service";

import NotificationPromt from "@/components/Notifications/NotificationPromt";
import { DashboardTicket } from "@/types/custom.types";

import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";

interface CitizenDashboardProps {
  searchParams: any;
}

export default function CitizenDashboard({
  searchParams,
}: CitizenDashboardProps) {
  const userProfile = useProfile();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [dashMostUpvoteResults, setMostUpvoteResults] = useState<any[]>([]);
  const [dashMuniResults, setDashMuniResults] = useState<any[]>([]);
  const [dashWatchResults, setDashWatchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [userEmail, setUserEmail] = useState("");

  const [deeplinkTicket, setDeeplinkTicket] = useState<
    DashboardTicket | undefined
  >();
  const deeplinkTicketId = searchParams["t_id"];

  const refreshwatchlist = async () => {
    try {
      console.log("Refresh inside");
      const user_data = await userProfile.getUserProfile();
      const user_id = user_data.current?.email ?? "";
      const user_email = String(user_id).toLowerCase();
      const user_session = String(user_data.current?.session_token);
      console.log("User Session", user_session);
      const rspwatchlist = await getWatchlistTickets(
        user_email,
        user_session,
        true
      );
      setDashWatchResults(rspwatchlist.length > 0 ? rspwatchlist : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const mockUnreadNotifications = () => {
      // Mock the unread notifications count with a random number
      const mockUnreadNotifications = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
      setUnreadNotifications(mockUnreadNotifications);
    };

    const getDeeplinkTicket = async () => {
      const user_data = await userProfile.getUserProfile();
      const userSession = String(user_data.current?.session_token);
      //check if the ticket id query parameter is present
      if (!deeplinkTicketId) {
        //return if not present
        return;
      }

      //get the ticket
      const deepTicket = await getTicket(deeplinkTicketId, userSession);
      if (deepTicket.length == 1) {
        setDeeplinkTicket(deepTicket[0]);
      }
    };

    const fetchData = async () => {
      try {
        const user_data = await userProfile.getUserProfile();
        const user_id = user_data.current?.email ?? "";
        setUserEmail(user_id);
        const user_session = String(user_data.current?.session_token);
        const user_email = String(user_id).toLowerCase();
        const rspmostupvotes = await getMostUpvote(user_session, true);
        const rspwatchlist = await getWatchlistTickets(
          user_email,
          user_session,
          true
        );
        const municipality = user_data.current?.municipality;
        const rspmunicipality = await getTicketsInMunicipality(
          municipality,
          user_session,
          true
        );

        // Preload images for all the fetched results
        const imagesToPreload = [
          ...rspmostupvotes,
          ...rspwatchlist,
          ...rspmunicipality,
        ].map((item) => item.image);

        preloadImages(imagesToPreload);

        console.log("Upvotes", rspmostupvotes);

        setMostUpvoteResults(rspmostupvotes);

        console.log(Array.isArray(rspmunicipality) ? rspmunicipality : []);
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

    mockUnreadNotifications();
    getDeeplinkTicket();
    fetchData();
  }, []);

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
      {/* fault popup used with deeplink starts here*/}

      {deeplinkTicket && (
        <FaultCardUserView
          show={true}
          onClose={() => {
            // update url to remove ticket id parameter
            const url = new URL(window.location.href);
            url.searchParams.delete("t_id");
            window.history.replaceState({}, "", url.toString());
            setDeeplinkTicket(undefined);
          }}
          title={deeplinkTicket.asset_id}
          address={deeplinkTicket.address}
          arrowCount={deeplinkTicket.upvotes}
          commentCount={deeplinkTicket.commentcount}
          viewCount={deeplinkTicket.viewcount}
          ticketId={deeplinkTicket.ticket_id}
          ticketNumber={deeplinkTicket.ticketnumber}
          description={deeplinkTicket.description}
          image={deeplinkTicket.imageURL}
          createdBy={deeplinkTicket.createdby}
          latitude={deeplinkTicket.latitude}
          longitude={deeplinkTicket.longitude}
          urgency={deeplinkTicket.urgency}
          state={deeplinkTicket.state}
          municipality_id={deeplinkTicket.municipality_id}
          refreshwatchlist={refreshwatchlist}
        />
      )}
      {/* fault popup used with deeplink ends here */}

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex flex-col">
          <NavbarUser unreadNotifications={unreadNotifications} />
          <div className="flex justify-center z-50 pt-8">
            <NotificationPromt userEmail={userEmail} />
          </div>

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
              backgroundAttachment: "fixed",
              zIndex: -1,
            }}
          ></div>

          <main className="flex justify-center">
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

            <div className="flex flex-col w-full h-[60%] items-center lg:mt-10 overflow-hidden">
              <div className="flex h-full dark:bg-gray-700 dark:text-white dark:bg-opacity-70 bg-gray-100 bg-opacity-70 flex-col items-center rounded-3xl w-3/4">
                <Tabs
                  aria-label="Signup Options"
                  defaultSelectedKey={0}
                  className="flex justify-center w-full rounded-3xl pt-4"
                  classNames={{
                    tab: "min-w-28 bg-opacity-30 text-black",
                    panel: "w-full h-full",
                    cursor: "w-full border-3 border-blue-700/40",
                    tabContent:
                      "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md group-data-[selected=true]:bg-opacity-60 group-data-[selected=true]:text-black",
                  }}
                  onSelectionChange={handleTabChange}
                >
                  <Tab key={0} title="Cards" className="h-full ">
                    <Tabs
                      aria-label="Signup Options"
                      defaultSelectedKey={0}
                      className="flex justify-center w-full rounded-3xl "
                      classNames={{
                        tab: "min-w-24 bg-opacity-30 text-black text-xs",
                        panel: "w-full",
                        cursor: "w-full border-3 border-blue-700/40",
                        tabContent:
                          "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md group-data-[selected=true]:bg-opacity-60 group-data-[selected=true]:text-black",
                      }}
                      onSelectionChange={handleTabChange}
                    >
                      {/* Watchlist */}
                      <Tab key={0} title="Watchlist" className=" h-full">
                        <div className="h-full">
                          <h1 className="text-l text-opacity-80 text-white text-center">
                            All of the issues you have in your watchlist.
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
                            <div className="h-[60%]">
                              <DashboardFaultCardContainer
                                cardData={dashWatchResults}
                                refreshwatch={refreshwatchlist}
                              />
                            </div>
                          ) : (
                            <p className="text-center text-white text-opacity-60 text-sm">
                              There are no faults to display.
                            </p>
                          )}
                        </div>
                      </Tab>

                      {/* Most Upvoted*/}
                      <Tab key={1} title="Most Upvoted">
                        <div className="w-full text-center"></div>
                        <div className="w-full text-center">
                          <h1 className="sm:text-sm md:text-md lg:text-lg text-white text-opacity-80">
                            Based on votes from the community in your area.
                          </h1>
                        </div>
                        {isLoading ? (
                          <div className="flex justify-center items-center ">
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
                            refreshwatch={refreshwatchlist}
                          />
                        ) : (
                          <p className="text-center text-white text-opacity-60 text-sm">
                            There are no faults to display.
                          </p>
                        )}
                      </Tab>

                      {/* Nearest to you*/}
                      <Tab key={2} title="Nearest to you">
                        <h1 className="text-center text-white text-opacity-80">
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
                          <DashboardFaultCardContainer
                            cardData={dashMuniResults}
                            refreshwatch={refreshwatchlist}
                          />
                        ) : (
                          <p className="text-center text-sm text-opacity-60 text-white">
                            There are no faults to display.
                          </p>
                        )}
                      </Tab>
                    </Tabs>
                  </Tab>

                  <Tab key={1} title="List">
                    <FaultTable
                      tableitems={dashMostUpvoteResults}
                      refreshwatch={refreshwatchlist}
                    />
                  </Tab>

                  <Tab key={2} title="Map">
                    <div className="flex justify-center z-50 pt-8">
                      <LocationPrompt />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 mt-2 ml-2 text-center text-white text-opacity-70">
                      Faults Near You
                    </h1>
                    <FaultMapView />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden ">
        <div className="flex flex-col h-full overflow-hidden">
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
              backgroundAttachment: "fixed",
              zIndex: -1,
            }}
          >
            {/* Navbar Top*/}
            <NavbarMobile />

            {/* Notification Prompt */}
            <div className="flex justify-center z-50 pt-8">
              <NotificationPromt userEmail={userEmail} />
            </div>

            {/* Dashboard Content */}
            <div className="h-[85vh]">
              <div className="flex justify-center">
                <h1 className="text-4xl font-bold text-white text-opacity-80">
                  Dashboard
                </h1>
              </div>

              <div className="flex h-[80vh] flex-col items-center rounded-3xl">
                <Tabs
                  aria-label="Signup Options"
                  defaultSelectedKey={0}
                  className="flex justify-center w-full rounded-3xl pt-4"
                  classNames={{
                    tab: "min-w-28 min-h-10  bg-white bg-opacity-30 text-black",
                    panel: "w-full h-full",
                    cursor: "w-full border-3 border-blue-700/40",
                    tabContent:
                      "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md group-data-[selected=true]:bg-white group-data-[selected=true]:bg-opacity-60 group-data-[selected=true]:text-black",
                  }}
                  onSelectionChange={handleTabChange}
                >
                  <Tab key={0} title="Cards" className="h-full ">
                    <Tabs
                      aria-label="Signup Options"
                      defaultSelectedKey={0}
                      className="mt-2 flex justify-center w-full rounded-3xl "
                      classNames={{
                        tab: "min-w-24 min-h-8bg-white bg-opacity-30 text-black text-xs",
                        panel: "w-full",
                        cursor: "w-full border-3 border-blue-700/40",
                        tabContent:
                          "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md group-data-[selected=true]:bg-white group-data-[selected=true]:bg-opacity-60 group-data-[selected=true]:text-black",
                      }}
                      onSelectionChange={handleTabChange}
                    >
                      <Tab key={0} title="Watchlist" className=" h-full">
                        <div className="  h-full">
                          <h1 className="text-l text-opacity-80 text-white text-center mb-2">
                            All of the issues you have in your watchlist.
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
                            <div className="h-full">
                              <DashboardFaultCardContainer
                                cardData={dashWatchResults}
                                refreshwatch={refreshwatchlist}
                              />
                            </div>
                          ) : (
                            <p className="text-center text-white text-opacity-60 text-sm">
                              There are no faults to display.
                            </p>
                          )}
                        </div>
                      </Tab>

                      <Tab key={1} title="Most Upvoted">
                        <div className="w-full text-center"></div>
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
                            refreshwatch={refreshwatchlist}
                          />
                        ) : (
                          <p className="text-center text-white text-opacity-60 text-sm">
                            There are no faults to display.
                          </p>
                        )}
                      </Tab>

                      <Tab key={2} title="Nearest to you">
                        <h1 className="text-center text-white text-opacity-80 mb-4 ml-2">
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
                          <DashboardFaultCardContainer
                            cardData={dashMuniResults}
                            refreshwatch={refreshwatchlist}
                          />
                        ) : (
                          <p className="text-center text-sm text-opacity-60 text-white">
                            There are no faults to display.
                          </p>
                        )}
                      </Tab>
                    </Tabs>
                  </Tab>

                  <Tab key={1} title="List">
                    <FaultTable
                      tableitems={dashMostUpvoteResults}
                      refreshwatch={refreshwatchlist}
                    />
                  </Tab>

                  <Tab key={2} title="Map">
                    <div className="flex justify-center z-50 pt-8">
                      <LocationPrompt />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 mt-2 ml-2 text-center text-white text-opacity-70">
                      Faults Near You
                    </h1>
                    <FaultMapView />
                  </Tab>
                </Tabs>
              </div>
            </div>

            {/* Navbar Bottom */}
            <div className="">
              <NavbarUser unreadNotifications={unreadNotifications} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
