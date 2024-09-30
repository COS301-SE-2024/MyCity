"use client";

import { Tabs, Tab } from "@nextui-org/react";
import CitizenLogin from "@/components/Login/CitizenLogin";
import MunicipalityLogin from "@/components/Login/MunicipalityLogin";
import ServiceProviderLogin from "@/components/Login/ServiceProviderLogin";
import NavbarGuest from "@/components/Navbar/NavbarGuest";

export default function Login() {
  const formHeader: string = "Log In.";

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
            <div className="flex dark:bg-gray-700 dark:text-white bg-gray-100 items-center justify-center rounded-lg shadow-lg shadow-blue-800/15 w-1/2 h-fit py-12 mt-12">
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
                  {formHeader}
                </span>
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
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          style={{
            position: "relative",
            minHeight: "100vh", // Ensures the full viewport height
          }}
          className="px-2 pb-20 overflow-auto" // Allow scrolling and add bottom padding
        >
          {/* Logo */}
          <div className="flex justify-center items-center text-white font-bold transform hover:scale-105 mt-3 ml-3 transition-transform duration-200">
            <img
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-128.webp"
              alt="MyCity"
              className="w-16 h-16" // Responsive sizing
            />
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
              backgroundRepeat: "repeat", // Repeat to fill space
              zIndex: -1,
            }}
          ></div>

          {/* Content */}
          <div className="mt-5 flex flex-col bg-white items-center rounded-lg shadow-lg shadow-blue-800/15 p-4 mx-2 space-y-4">
            {/* Form Header */}
            <span className="text-xl font-bold">{formHeader}</span>

            {/* Login Options Image */}
            <div className="flex justify-center">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Login.gif"
                alt="MyCity"
                className="w-32 h-32" // Responsive image size
              />
            </div>

            {/* Tabs Component */}
            <div className="w-full overflow-auto h-[65vh]">
              <Tabs
                aria-label="Signup Options"
                defaultSelectedKey={0}
                className="mt-2 flex justify-center w-full"
                classNames={{
                  tab: "min-h-10 text-sm", // Smaller text size for tabs
                  panel: "w-full",
                  cursor: "w-full bg-blue-200/20 border-3 border-blue-700/40",
                  tabContent:
                    "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md",
                }}
              >
                <Tab key={0} title="Citizen" data-testid="mobile-citizen-tab">
                  <CitizenLogin />
                </Tab>
                <Tab
                  key={1}
                  title="Municipality"
                  data-testid="mobile-municipality-tab"
                >
                  <MunicipalityLogin />
                </Tab>
                <Tab
                  key={2}
                  title="Service Provider"
                  data-testid="mobile-service-provider-tab"
                >
                  <ServiceProviderLogin />
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
