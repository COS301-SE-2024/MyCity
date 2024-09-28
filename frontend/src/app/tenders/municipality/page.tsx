"use client"

import React, { Key, useEffect, useState } from "react";
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import { Tab, Tabs } from "@nextui-org/react";
import ClosedTenders from "@/components/RecordsTable/ClosedTenders";
import ActiveTenders from "@/components/RecordsTable/ActiveTenders";
import OpenTicketsTable from "@/components/RecordsTable/OpenTicketsTable";
import { useProfile } from "@/hooks/useProfile";
import { getTicketsInMunicipality } from "@/services/tickets.service";
import { getMunicipalityTenders } from "@/services/tender.service";
import { ThreeDots } from "react-loader-spinner";
import NavbarMobile from "@/components/Navbar/NavbarMobile";

export default function MuniTenders() {
  const userProfile: any = useProfile();
  const [dashMuniResults, setDashMuniResults] = useState<any[]>([]);
  const [muniTenders, setMuniTenders] = useState<any[]>([]);
  const [loadingOpenTickets, setLoadingOpenTickets] = useState(true);
  const [loadingActiveTenders, setLoadingActiveTenders] = useState(true);
  const [loadingClosedTenders, setLoadingClosedTenders] = useState(true);

  const handleTabChange = (key: Key) => {
    const index = Number(key);
    // Depending on the selected tab, trigger the loading state for the first load
    if (index === 1 && loadingActiveTenders) {
      setLoadingActiveTenders(false); // Assumes component loads quickly after mount
    } else if (index === 2 && loadingClosedTenders) {
      setLoadingClosedTenders(false); // Assumes component loads quickly after mount
    }
  };

  const fetchTenders = async () => {
    const user_data = await userProfile.getUserProfile();
    const user_session = String(user_data.current?.session_token);
    const user_municipality = String(user_data.current?.municipality);
    const rspmunitenders = await getMunicipalityTenders(
      user_municipality,
      user_session
    );
    setMuniTenders(rspmunitenders);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingOpenTickets(true);
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const user_municipality = String(user_data.current?.municipality);
      const [rspmunicipality, rspmunitenders] = await Promise.all([
        getTicketsInMunicipality(user_municipality, user_session),
        getMunicipalityTenders(user_municipality, user_session)
      ]);
      setMuniTenders(rspmunitenders);
      setDashMuniResults(Array.isArray(rspmunicipality) ? rspmunicipality : []);
      setLoadingOpenTickets(false);
    };
    fetchData();
  }, [userProfile]);

  const unreadNotifications = Math.floor(Math.random() * 10) + 1;

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <NavbarMunicipality unreadNotifications={unreadNotifications} />
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
          <main>
            <div className="flex items-center mb-2 mt-2 ml-2">
              <div className="flex items-center mb-2 mt-6 ml-9 pt-15">
                <h1 className="text-4xl font-bold text-white text-opacity-80">
                  Tenders
                </h1>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg h-fit py-1">
              <Tabs
                aria-label="Signup Options"
                defaultSelectedKey={0}
                className="mt-5 flex justify-center w-full"
                classNames={{
                  tab: "min-w-32 min-h-10 bg-white bg-opacity-30 text-black",
                  panel: "w-full",
                  cursor: "w-full border-3 border-blue-700/40",
                  tabContent:
                    "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md group-data-[selected=true]:bg-white group-data-[selected=true]:bg-opacity-60 group-data-[selected=true]:text-black",
                }}
                onSelectionChange={handleTabChange}
              >
                <Tab key={0} title="Open Tickets">
                  {loadingOpenTickets ? (
                    <div className="flex justify-center items-center">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  ) : (
                    <OpenTicketsTable records={dashMuniResults} />
                  )}
                </Tab>

                <Tab key={1} title="Active Tenders">
                  {loadingActiveTenders ? (
                    <div className="flex justify-center items-center">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  ) : (
                    <ActiveTenders
                      tenders={muniTenders}
                      refresh={fetchTenders}
                    />
                  )}
                </Tab>

                {/* <Tab key={2} title="Closed Tenders">
                  {loadingClosedTenders ? (
                    <div className="flex justify-center items-center">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  ) : (
                    <ClosedTenders tickets={dashMuniResults} />
                  )}
                </Tab> */}
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <NavbarMunicipality unreadNotifications={unreadNotifications} />
        <NavbarMobile />

        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden", // Prevents content overflow
          }}
        >
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
          <div className="container mx-auto relative pt-10 px-4">
            {/* Add a border around the heading */}
            <div className=" rounded-lg mt-10 mb-4">
              <h1 className="text-3xl text-white font-bold text-center">
                Tenders
              </h1>
            </div>

            {/* Tab Layout with a border */}
            <div className="bg-transparent rounded-lg">
              <Tabs
                aria-label="Tender options"
                defaultSelectedKey={0}
                className="w-full items-center justify-center"
                classNames={{
                  tab: "min-w-24 min-h-8 text-black",
                  tabContent:
                    "group-data-[selected=true]:font-bold group-data-[selected=true]:bg-transparent text-black",
                  panel: "w-full",
                }}
                onSelectionChange={handleTabChange}
              >
                <Tab key={0} title="Open Tickets">
                  {loadingOpenTickets ? (
                    <div className="flex justify-center items-center mt-4">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <OpenTicketsTable records={dashMuniResults} />
                  )}
                </Tab>

                <Tab key={1} title="Active Tenders">
                  {loadingActiveTenders ? (
                    <div className="flex justify-center items-center mt-4">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <ActiveTenders
                      tenders={muniTenders}
                      refresh={fetchTenders}
                    />
                  )}
                </Tab>

                {/* <Tab key={2} title="Closed Tenders">
                  {loadingClosedTenders ? (
                    <div className="flex justify-center items-center mt-4">
                      <ThreeDots
                        height="40"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <ClosedTenders tickets={dashMuniResults} />
                  )}
                </Tab> */}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}