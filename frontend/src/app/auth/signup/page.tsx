"use client";

import React, { Key, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";

import CitizenSignup from "@/components/Signup/CitizenSignup";
import MunicipalitySignup from "@/components/Signup/MunicipalitySignup";
import ServiceProviderSignup from "@/components/Signup/ServiceProviderSignup";
import PrivateCompanySignup from "@/components/Signup/PrivateCompanySignup";
import Navbar from "@/components/Navbar/Navbar";

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
          <main className="h-screen flex justify-center p-20">
            <div className="flex flex-col bg-white items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit py-12">
              <span className="text-[2.5em] font-bold">
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
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
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
          />

          <main className="h-screen flex justify-center p-20">
            <div className="flex flex-col bg-white items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit py-12">
              <span className="text-[2.5em] font-bold">
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
          </main>
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
