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
import DashboardFaultCardContainer from "@/components/FaultCardContainer/DashboardFualtCardContainer";
import axios from "axios";



export default function CitizenDashboard() {
  const user = useRef(null);
  const userProfile = useProfile();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [dashMuniResults, setDashMuniResults] = useState<any[]>([]); 
  const [dashWatchResults, setDashWatchResults] = useState<any[]>([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_data = await userProfile.getUserProfile()
        const user_id = user_data.current?.sub
        const rspwatchlist = await axios.post('https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/tickets/view?ticket_id=8f4cf09d-754e-4d71-96dc-952173fab07c',{
          username : user_id
        });
        const municipality = user_data.current?.municipality
        const rspmunicipality = await axios.post('https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/tickets/getinarea',{
          municipality_id : municipality
        });
        console.log(user_id)
        console.log(rspmunicipality.data)
        console.log(municipality)
        console.log(rspwatchlist.data)
        const flattenedWatchlist = rspwatchlist.data.flat();
        setDashMuniResults(rspmunicipality.data)
        setDashWatchResults(flattenedWatchlist)
       
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (key: Key) => {
    const index = Number(key);
  };

  const toggleHelpMenu = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const hasStatusFieldMuni = dashMuniResults.some(item => item.Status !== undefined);
  const hasStatusFieldWatch = dashWatchResults.some(item => item.Status !== undefined);

  return (
    <div>
      <Navbar />
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
          <h1 className="text-4xl font-bold text-white text-opacity-80 ">Dashboard</h1>
          <HelpCircle
            className="ml-2 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
            size={24}
            onClick={toggleHelpMenu}
          />
        </div>

        {isHelpOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative">
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
              <p>
                Use the tabs to navigate between different sections of the
                dashboard.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center rounded-lg h-fit py-1">
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
              <div className="justify-center text-center">
                <FaultCardContainer/>
              </div>

              <h1 className="text-2xl text-center text-white text-opacity-80 font-bold mt-2 ml-2">
                Nearest to you
              </h1>
              <div className="w-full text-center">
                <h1 className="text-l text-white text-opacity-80 mb-4">
                  Based on your proximity to the issue.
                </h1>
              </div>
              <div className="justify-center text-center">
                <FaultCardContainer />
              </div>
                  {hasStatusFieldMuni ? (
                    <FaultCardContainer />
                  ) : (
                    <DashboardFaultCardContainer cardData={dashMuniResults} />
                  )}
              <h1 className="text-2xl text-white text-opacity-80 text-center font-bold mt-2 ml-2">
                Watchlist
              </h1>
              <div className="w-full text-center">
                <h1 className="text-l text-white text-opacity-80 mb-4">
                  Based on your watchlist.
                </h1>
              </div>
              <div className="justify-center text-center">
                <FaultCardContainer />
              </div>
              {hasStatusFieldWatch ? (
                  <FaultCardContainer />
                ) : (
                  <DashboardFaultCardContainer cardData={dashWatchResults} />
                  )}
            </Tab>

            <Tab key={1} title="List">
              <FaultTable />
            </Tab>

            <Tab key={2} title="Map">
              <h1 className="text-4xl font-bold mb-4 mt-2 ml-2 text-center text-white text-opacity-80">
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
