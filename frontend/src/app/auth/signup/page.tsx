"use client";

import React, { Key, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";

import CitizenSignup from "@/components/Signup/CitizenSignup";
import MunicipalitySignup from "@/components/Signup/MunicipalitySignup";
import ServiceProviderSignup from "@/components/Signup/ServiceProviderSignup";
import PrivateCompanySignup from "@/components/Signup/PrivateCompanySignup";
import NavbarGuest from "@/components/Navbar/NavbarGuest";

export default function Signup() {
  const headers: string[] = ["Get Connected.", "Take Control.", "Be The Change."];
  const [currentFormHeader, setCurrentFormHeader] = useState(headers[2]);

  const handleTabChange = (key: Key) => {
    const index = Number(key);
    setCurrentFormHeader(headers[index]);
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="relative">
          <NavbarGuest />
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
          <main className="flex justify-center mb-8">
            <div className="flex flex-col bg-white items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[40em] h-fit py-12 mt-12">
              <span className="text-[2.5em] font-bold">{currentFormHeader}</span>
              <Tabs
                aria-label="Signup Options"
                defaultSelectedKey={2}
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
                <Tab key={0} title="Citizen" data-testid="citizen-tab">
                  <CitizenSignup />
                </Tab>
                <Tab key={1} title="Municipality" data-testid="municipality-tab">
                  <MunicipalitySignup />
                </Tab>
                <Tab key={2} title="Service Provider" data-testid="service-provider-tab">
                  <ServiceProviderTabs />
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
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-128.webp"
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

function ServiceProviderTabs() {
  const [currentSubTab, setCurrentSubTab] = useState(0);

  return (
    <Tabs
      aria-label="Service Provider Options"
      defaultSelectedKey={0}
      className="mt-5 flex justify-center w-full"
      classNames={{
        tab: "min-w-24 min-h-8 text-sm font-light",
        panel: "w-full",
        cursor: "w-full bg-blue-100/20 border-2 border-blue-400/40",
        tabContent:
          "group-data-[selected=true]:font-medium group-data-[selected=true]:dop-shadow-sm",
      }}
      onSelectionChange={(key) => setCurrentSubTab(Number(key))}
    >
      <Tab key={0} title="Employee" data-testid="service-provider-subtab">
        <ServiceProviderSignup />
      </Tab>
      <Tab key={1} title="Company" data-testid="private-company-subtab">
        <PrivateCompanySignup />
      </Tab>
    </Tabs>
  );
}
