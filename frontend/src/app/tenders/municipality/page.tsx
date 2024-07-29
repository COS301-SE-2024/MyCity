"use client";

import React, { Key, useEffect, useRef, useState } from "react";
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import { Tab, Tabs } from "@nextui-org/react";
import OpenTicketsTable from "@/components/RecordsTable/OpenTicketsTable";
export default function MuniTenders() {
  const handleTabChange = (key: Key) => {
    const index = Number(key);
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <NavbarMunicipality />
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
                  <div className="text-white p-4 text-center font-bold text-xl text-opacity-80">
                    Select a Ticket to see all bids submitted for it.
                  </div>
                  <OpenTicketsTable />
                </Tab>

                <Tab key={1} title="Active Tenders">
                  <div className="text-white">Select a Ticket to bid for.</div>
                </Tab>

                <Tab key={2} title="Closed Tenders">
                  <div className="text-white">Select a Ticket to bid for.</div>
                </Tab>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden"></div>
    </div>
  );
}
