"use client";

import React, { Key, useEffect, useRef, useState } from "react";
import NavbarCompany from "@/components/Navbar/NavbarCompany";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleTabChange = (key: Key) => {
    const index = Number(key);
  };

  const toggleHelpMenu = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const user_data = await userProfile.getUserProfile();
        const user_company = String(user_data.current?.company_name);
        const user_session = String(user_data.current?.session_token);
        const rspmostupvotes = await getOpenCompanyTickets(user_session);
        const rsptenders = await getCompanyTenders(user_company, user_session, true);
        setOpenTickets(rspmostupvotes);
        setMytenders(rsptenders);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userProfile]);

  useEffect(() => {
    console.log(openTickets); // This will log the updated openTickets whenever it changes
  }, [openTickets]);

  return (
    <div>
      {/* Help Menu Button */}
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
            <div className="flex items-center mb-2 mt-2 ml-2">
              <h1 className="text-4xl font-bold text-white text-opacity-80 ">
                Tenders
              </h1>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg h-fit py-1">
              {isLoading ? (
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
                <Tabs
                  aria-label="Signup Options"
                  defaultSelectedKey={0}
                  className="mt-5 flex justify-center w-full"
                  classNames={{
                    tab: "min-w-32 min-h-10 bg-white bg-opacity-30 text-black", // more transparent white background for tabs
                    panel: "w-full",
                    cursor: "w-full border-3 border-blue-700/40",
                    tabContent:
                      "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md group-data-[selected=true]:bg-white group-data-[selected=true]:bg-opacity-60 group-data-[selected=true]:text-black", // slightly more transparent for selected tab
                  }}
                  onSelectionChange={handleTabChange}
                >
                  <Tab key={0} title="Open Tickets">
                    <div className="p-4 text-center font-bold text-xl text-opacity-80"></div>
                    <OpenTicketsTable records={openTickets} />
                  </Tab>

                  <Tab key={1} title="Active Tenders">
                    <ActiveTenders tenders={mytenders} />
                  </Tab>

                  <Tab key={2} title="Closed Tenders">
                    <ClosedTenders />
                  </Tab>
                </Tabs>
              )}
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
            overflow: "hidden", // Prevents content overflow
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
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10">
            {" "}
            {/* Ensure content is above the background */}
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
