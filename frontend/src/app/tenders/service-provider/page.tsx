"use client";

import React, { Key, useEffect, useState } from "react";
import NavbarCompany from "@/components/Navbar/NavbarCompany";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import { Tab, Tabs } from "@nextui-org/react";
import ClosedTenders from "@/components/RecordsTableCompany/ClosedTenders";
import ActiveTenders from "@/components/RecordsTableCompany/ActiveTenders";
import OpenTicketsTable from "@/components/RecordsTableCompany/OpenTicketsTable";
import { useProfile } from "@/hooks/useProfile";
import { getOpenCompanyTickets } from "@/services/tickets.service";
import { getCompanyTenders } from "@/services/tender.service";
import { FaTimes } from "react-icons/fa";
import { HelpCircle } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";

export default function MuniTenders() {
  const userProfile = useProfile();
  const [openTickets, setOpenTickets] = useState<any[]>([]);
  const [mytenders, setMytenders] = useState<any[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [loadingTabs, setLoadingTabs] = useState({
    openTickets: true,
    activeTenders: false,
    closedTenders: false,
  });

  const fetchDataForTab = async (tab: keyof typeof loadingTabs) => {
    try {
      setLoadingTabs((prev) => ({ ...prev, [tab]: true }));
      const user_data = await userProfile.getUserProfile();
      const user_company = String(user_data.current?.company_name);
      const user_session = String(user_data.current?.session_token);

      if (tab === "openTickets") {
        const rspmostupvotes = await getOpenCompanyTickets(user_session);
        setOpenTickets(rspmostupvotes);
      } else if (tab === "activeTenders") {
        const rsptenders = await getCompanyTenders(user_company, user_session, true);
        console.log(rsptenders)
        setMytenders(rsptenders);
      }
      // You could handle fetching for "closedTenders" similarly if needed
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, [tab]: false }));
    }
  };

  const fetchDataForAllTabs = async () => {
    try {
      setLoadingTabs({ openTickets: true, activeTenders: true, closedTenders: false });
      const user_data = await userProfile.getUserProfile();
      const user_company = String(user_data.current?.company_name);
      const user_session = String(user_data.current?.session_token);

      const [rspmostupvotes, rsptenders] = await Promise.all([
        getOpenCompanyTickets(user_session),
        getCompanyTenders(user_company, user_session, true),
      ]);
      setOpenTickets(rspmostupvotes);
      console.log(rsptenders);
      setMytenders(rsptenders);
      // You could handle fetching for "closedTenders" similarly if needed
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingTabs({ openTickets: false, activeTenders: false, closedTenders: false });
    }
  };

  // const handleTabChange = async (key: Key) => {
  //   const index = Number(key);

  //   switch (index) {
  //     case 0:
  //       if (!openTickets.length) await fetchDataForTab("openTickets");
  //       break;
  //     case 1:
  //       if (!mytenders.length) await fetchDataForTab("activeTenders");
  //       break;
  //     case 2:
  //       if (!loadingTabs.closedTenders) {
  //         // Assume closed tenders don't require fetching
  //         setLoadingTabs((prev) => ({ ...prev, closedTenders: false }));
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const toggleHelpMenu = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  useEffect(() => {
    // fetchDataForTab("openTickets");
    fetchDataForAllTabs();
  }, [userProfile]);

  const unreadNotifications = Math.floor(Math.random() * 10) + 1;

  return (
    <div>


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
            <p>This page allows you to:</p>
            <ul className="list-disc list-inside">
              <li>View and bid for open fault tickets in your company&apos;s region.</li>
              <li>Access active and closed tenders associated with your company.</li>
              <li>Navigate between tabs to see different sets of records.</li>
            </ul>
            <p>
              Use the tabs to switch between open tickets, active tenders, and closed tenders. Each tab provides detailed information on the respective records.
            </p>
          </div>
        </div>
      )}

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <NavbarCompany unreadNotifications={unreadNotifications} />
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
          <main>
            <div className="flex items-center mb-2 mt-2 ml-2">
              <div className="flex items-center mb-2 mt-6 ml-9 pt-15">
                <h1 className="text-4xl font-bold text-white text-opacity-80">Tenders</h1>
              </div>
            </div>
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
              >
                <Tab key={0} title="Open Tickets">
                  {loadingTabs.openTickets ? (
                    <div className="flex justify-center items-center h-64">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <OpenTicketsTable records={openTickets} />
                  )}
                </Tab>

                <Tab key={1} title="Active Tenders">
                  {loadingTabs.activeTenders ? (
                    <div className="flex justify-center items-center h-64">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <ActiveTenders tenders={mytenders} />
                  )}
                </Tab>

                {/* <Tab key={2} title="Closed Tenders">
                  {loadingTabs.closedTenders ? (
                    <div className="flex justify-center items-center h-64">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <ClosedTenders />
                  )}
                </Tab> */}
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <NavbarCompany unreadNotifications={unreadNotifications} />
        <NavbarMobile />
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
          ></div>

          {/* Content */}
          <div className="container mx-auto relative pt-10 px-4">
            <div className="rounded-lg mt-10 mb-4">
              <h1 className="text-3xl text-white font-bold text-center">
                Tenders
              </h1>
            </div>
            <div className="bg-transparent rounded-lg ">
              <Tabs
                aria-label="Tender options"
                defaultSelectedKey={0}
                className="w-full items-center justify-center"
                classNames={{
                  tab: "min-w-24 min-h-8 text-black",
                  tabContent:
                    "group-data-[selected=true]:font-bold group-data-[selected=true]:bg-transparent text-black",
                  panel: "w-full",
                }}
              >
                <Tab key={0} title="Open Tickets">
                  {loadingTabs.openTickets ? (
                    <div className="flex justify-center items-center mt-4">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <OpenTicketsTable records={openTickets} />
                  )}
                </Tab>

                <Tab key={1} title="Active Tenders">
                  {loadingTabs.activeTenders ? (
                    <div className="flex justify-center items-center mt-4">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <ActiveTenders tenders={mytenders} />
                  )}
                </Tab>

                <Tab key={2} title="Closed Tenders">
                  {loadingTabs.closedTenders ? (
                    <div className="flex justify-center items-center mt-4">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <ClosedTenders />
                  )}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
