"use client";

import React, { Key, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";

import CitizenSignup from "@/components/Signup/CitizenSignup";
import MunicipalitySignup from "@/components/Signup/MunicipalitySignup";
import ServiceProviderSignup from "@/components/Signup/ServiceProviderSignup";
import PrivateCompanySignup from "@/components/Signup/PrivateCompanySignup";
import NavbarGuest from "@/components/Navbar/NavbarGuest";

export default function Signup() {
  const headers: string[] = [
    "Get Connected.",
    "Take Control.",
    "Be The Change.",
  ];
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
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              zIndex: -1,
            }}
          ></div>
          <main className="flex justify-center mb-8">
            <div className="flex flex dark:bg-gray-700 dark:text-white bg-gray-100 items-center justify-center rounded-lg shadow-lg shadow-blue-800/15 w-1/2 h-fit py-12 mt-12">
            <div>
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/login_icon.webp"
                  alt="MyCity"
                  width={512}
                  height={512}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[2.5em] flex justify-center font-bold">
                  {currentFormHeader}
                </span>
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
                  <Tab
                    key={1}
                    title="Municipality"
                    data-testid="municipality-tab"
                  >
                    <MunicipalitySignup />
                  </Tab>
                  <Tab
                    key={2}
                    title="Service Provider"
                    data-testid="service-provider-tab"
                  >
                    <ServiceProviderTabs />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          style={{
            position: "relative",
            minHeight: "100vh", // Use minHeight to ensure full viewport coverage
          }}
          className="px-4 pb-20 overflow-auto" // Padding bottom to ensure content is above the navbar
        >
          {/* Centered Logo */}
          <div className="flex justify-center items-center mt-4">
            <div className="text-white text-center font-bold transform hover:scale-105 transition-transform duration-200">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-128.webp"
                alt="MyCity"
                className="w-16 h-16"
              />
            </div>
          </div>

          {/* Background Image */}
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
              backgroundRepeat: "repeat", // Ensure image repeats to cover all space
              zIndex: -1,
            }}
          ></div>

          {/* Content */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow-lg shadow-blue-800/15 p-4 mt-4 mx-2 space-y-4">
            {/* Form Header */}
            <span className="text-xl font-bold">{currentFormHeader}</span>

            {/* Signup Options Image */}
            <div className="flex justify-center">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Login.gif"
                alt="MyCity"
                className="w-32 h-32" // Responsive image size
              />
            </div>

            {/* Tabs Component */}
            <div className="w-full overflow-auto">
              <Tabs
                aria-label="Signup Options"
                defaultSelectedKey={0}
                className="mt-2 flex justify-center w-full"
                classNames={{
                  tab: "min-h-10 text-sm", // Apply smaller text size to tabs
                  panel: "w-full",
                  cursor: "w-full bg-blue-200/20 border-3 border-blue-700/40",
                  tabContent:
                    "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md",
                }}
                onSelectionChange={handleTabChange}
              >
                <Tab key={0} title="Citizen" data-testid="mobile-citizen-tab">
                  <CitizenSignup />
                </Tab>
                <Tab
                  key={1}
                  title="Municipality"
                  data-testid="mobile-municipality-tab"
                >
                  <MunicipalitySignup />
                </Tab>
                <Tab
                  key={2}
                  title="Service Provider"
                  data-testid="mobile-service-provider-tab"
                >
                  <ServiceProviderTabs />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Navbar */}
        <NavbarGuest />
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
      className="mt-1 flex justify-center w-full"
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
