"use client";

import React, { Key, useEffect, useRef, useState } from "react";
import NavbarCompany from "@/components/Navbar/NavbarCompany";
import { Tab, Tabs } from "@nextui-org/react";
import ClosedTenders from "@/components/RecordsTableCompany/ClosedTenders";
import ActiveTenders from "@/components/RecordsTableCompany/ActiveTenders";
import OpenTicketsTable from "@/components/RecordsTableCompany/OpenTicketsTable";
export default function MuniTenders() {
  const handleTabChange = (key: Key) => {
    const index = Number(key);
  };

  return (
    <div>
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
                  <div className="text-white p-4 text-center font-bold text-xl text-opacity-80"></div>
                  <OpenTicketsTable />
                </Tab>

                <Tab key={1} title="Active Tenders">
                  <ActiveTenders />
                </Tab>

                <Tab key={2} title="Closed Tenders">
                  <ClosedTenders />
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

          {/* <!--         <div className="flex flex-col items-center justify-center rounded-lg h-fit py-1">
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
            <div className="text-white p-4 text-center font-bold text-xl text-opacity-80"></div>
              <OpenTicketsTable />
            </Tab>

            <Tab key={1} title="Active Tenders">
              <ActiveTenders />
            </Tab>

            <Tab key={2} title="Closed Tenders">
            <ClosedTenders />
            </Tab>
          </Tabs> --> */}
        </div>
      </div>
    </div>
  );
}
