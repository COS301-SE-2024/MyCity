"use client";

import React, { Key, useEffect, useRef, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import FaultCardContainer from "@/components/FaultCardContainer/FaultCardContainer";
import FaultTable from "@/components/FaultTable/FaultTable";
import FaultMapView from "@/components/FaultMapView/FaultMapView";
import NavbarUser from "@/components/Navbar/NavbarUser";
import { useProfile } from "@/context/UserProfileContext";
import DashboardFaultCardContainer from "@/components/FaultCardContainer/DashboardFualtCardContainer";
import axios from "axios";



export default function CitizenDashboard() {
  const user = useRef(null);
  const userProfile = useProfile();
  const [dashMuniResults, setDashMuniResults] = useState<any[]>([]); 
  const [dashWatchResults, setDashWatchResults] = useState<any[]>([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_data = await userProfile.getUserProfile()
        const user_id = user_data.current.sub
        const rspwatchlist = await axios.post('https://api.example.com/data',{
          username : user_id
        });
        setDashWatchResults(rspwatchlist.data)
       
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (key: Key) => {
    const index = Number(key);
  };

  return (
    <div>
      <NavbarUser />

      <main>
        <h1 className="text-4xl font-bold mb-2 mt-2 ml-2">Dashboard</h1>

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
              <DashboardFaultCardContainer cardData={}/>
              <h1 className="text-2xl text-center font-bold mt-2 ml-2 text-center">Watchlist</h1>
              <h1 className="text-l text-center mb-4 ml-2">
                All of the issues you have added to your watchlist.
              </h1>
              <DashboardFaultCardContainer cardData={} />
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
