"use client";

import React, { Key, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";

import CitizenSignup from "@/components/Signup/CitizenSignup";
import MunicipalitySignup from "@/components/Signup/MunicipalitySignup";
import ServiceProviderSignup from "@/components/Signup/ServiceProviderSignup";
import PrivateCompanySignup from "@/components/Signup/PrivateCompanySignup";
import NavbarGuest from "@/components/Navbar/NavbarGuest";
import Image from "next/image";

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
                <Image
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Signup.gif"
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
            height: "100vh",
            overflow: "hidden", // Prevents content overflow
          }}
          className="px-2"
        >
          <div className="text-white font-bold ms-2 transform hover:scale-105 mt-3 ml-3 transition-transform duration-200">
            <Image
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-128.webp"
              alt="MyCity"
              width={75}
              height={75}
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
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>

          {/* Content */}
          <div className=" ">
            <div className="flex flex-col bg-white items-center rounded-lg  shadow-lg shadow-blue-800/15">
              <span className="text-[2.5em] font-bold">
                {currentFormHeader}
              </span>
              <div className="overflow-auto h-[74vh] rounded-lg">
                <div className="flex justify-center">
                  <Image
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Signup.gif"
                    alt="MyCity"
                    width={128}
                    height={128}
                  />
                </div>
                <Tabs
                  aria-label="Signup Options"
                  defaultSelectedKey={0}
                  className="mt-2 flex justify-center w-full"
                  classNames={{
                    tab: " min-h-10",
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
