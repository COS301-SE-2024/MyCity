"use client";

import React, { Key, useEffect, useRef, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import FaultCardContainer from "@/components/FaultCardContainer/FaultCardContainer";
import FaultTable from "@/components/FaultTable/FaultTable";
import FaultMapView from "@/components/FaultMapView/FaultMapView";
import Navbar from "@/components/Navbar/Navbar";
import { useProfile } from "@/context/UserProfileContext";
import { FaQuestionCircle, FaTimes } from "react-icons/fa";
import { HelpCircle } from "lucide-react";

export default function CitizenDashboard() {
  const user = useRef(null);
  const userProfile = useProfile();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup code here
    };
  }, []);

  const handleTabChange = (key: Key) => {
    const index = Number(key);
  };

  const toggleHelpMenu = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  return (
    <div>
      <Navbar />

      <main>
        <div className="flex items-center mb-2 mt-2 ml-2">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <HelpCircle
            className="ml-2 text-gray-600 cursor-pointer"
            size={24}
            onClick={toggleHelpMenu}
          />
        </div>

        {isHelpOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative">
              <button
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
                <li>Switch between different views: Cards, List, and Map.</li>
              </ul>
              <p>Use the tabs to navigate between different sections of the dashboard.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center rounded-lg h-fit py-1">
          <Tabs
            aria-label="Signup Options"
            defaultSelectedKey={0}
            className="mt-5 flex justify-center w-full"
            classNames={{
              tab: "min-w-32 min-h-10",
              panel: "w-full",
              cursor: "w-full bg-blue-200/20 border-3 border-blue-700/40",
              tabContent:
                "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md",
            }}
            onSelectionChange={handleTabChange}
          >
            <Tab key={0} title="Cards">
              <div className="w-full text-center">
                <h1 className="text-2xl font-bold mt-2">Most up-voted</h1>
              </div>
              <div className="w-full text-center">
                <h1 className="text-l mb-4">
                  Based on votes from the community in your area.
                </h1>
              </div>
              <div className="justify-center text-center">
                <FaultCardContainer />
              </div>

              <h1 className="text-2xl text-center font-bold mt-2 ml-2">Nearest to you</h1>
              <h1 className="text-center mb-4 ml-2">
                Based on your proximity to the issue.
              </h1>
              <FaultCardContainer />
              <h1 className="text-2xl text-center font-bold mt-2 ml-2">Watchlist</h1>
              <h1 className="text-l text-center mb-4 ml-2">
                All of the issues you have added to your watchlist.
              </h1>
              <FaultCardContainer />
            </Tab>

            <Tab key={1} title="List">
              <FaultTable />
            </Tab>

            <Tab key={2} title="Map">
              <h1 className="text-4xl font-bold mb-4 mt-2 ml-2 text-center">
                Pretoria
              </h1>
              <FaultMapView />
            </Tab>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
