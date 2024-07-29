"use client";

import { Tabs, Tab } from "@nextui-org/react";
import CitizenLogin from "@/components/Login/CitizenLogin";
import MunicipalityLogin from "@/components/Login/MunicipalityLogin";
import ServiceProviderLogin from "@/components/Login/ServiceProviderLogin";
import Navbar from "@/components/Navbar/Navbar";

export default function Login() {
  const formHeader: string = "Sign In.";

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
            <div className="flex bg-white flex-col items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit py-12">
              <span className="text-[2.5em] font-bold">{formHeader}</span>

              <Tabs
                aria-label="Login Options"
                defaultSelectedKey={0}
                className="mt-5 flex justify-center w-full"
                classNames={{
                  tab: "min-w-32 min-h-10",
                  panel: "w-full",
                  cursor: "w-full bg-blue-200/20 border-3 border-blue-700/40",
                  tabContent:
                    "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md",
                }}
              >
                <Tab key={0} title="Citizen" data-testid="citizen-tab">
                  <CitizenLogin />
                </Tab>

                <Tab
                  key={1}
                  title="Municipality"
                  data-testid="municipality-tab"
                >
                  <MunicipalityLogin />
                </Tab>

                <Tab
                  key={2}
                  title="Service Provider"
                  data-testid="service-provider-tab"
                >
                  <ServiceProviderLogin />
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
