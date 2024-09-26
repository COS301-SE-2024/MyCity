"use client"

import React, { useState, useCallback, useEffect } from "react";
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import RecordsTable from "@/components/RecordsTable/IntegratedRecordsTable";
import { ChevronDown } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { getTicketsInMunicipality } from "@/services/tickets.service";
import { ThreeDots } from "react-loader-spinner";
import { FaTimes } from "react-icons/fa";
import { HelpCircle } from "lucide-react";
import { Image as ImageIcon } from "lucide-react"; // Import the Image icon from Lucide

export default function Dashboard() {
  const [city, setCity] = useState<string | null>(null);
  const [muniprofile,setMuniprofile] = useState<string | null>(null);
  const [cityLoading, setCityLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const userProfile = useProfile();
  const [dashMuniResults, setDashMuniResults] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleHelpMenu = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const fetchData = async () => {
    const user_data = await userProfile.getUserProfile();
    const user_session = String(user_data.current?.session_token);
    const user_municipality = String(user_data.current?.municipality);
    const profile_pic = String(user_data.current?.picture)
    setMuniprofile(profile_pic)
    setCity(String(user_data.current?.municipality));
    setCityLoading(false);
    const rspmunicipality = await getTicketsInMunicipality(
      user_municipality,
      user_session,
      true
    );
    setDashMuniResults(Array.isArray(rspmunicipality) ? rspmunicipality : []);
    setTableLoading(false);
  };

  const fetchDataWithoutCache = useCallback(async () => {
    const user_data = await userProfile.getUserProfile();
    const user_session = String(user_data.current?.session_token);
    const user_municipality = String(user_data.current?.municipality);
    const profile_pic = String(user_data.current?.picture)
    setCity(String(user_data.current?.municipality));
    setMuniprofile(profile_pic)
    setCityLoading(false);
    const rspmunicipality = await getTicketsInMunicipality(
      user_municipality,
      user_session
    );
    setDashMuniResults(Array.isArray(rspmunicipality) ? rspmunicipality : []);
    setTableLoading(false);
  }, [userProfile]);

  useEffect(() => {
    fetchDataWithoutCache();
  }, [fetchDataWithoutCache]);

  const unreadNotifications = Math.floor(Math.random() * 10) + 1;

  return (
    <div>
      
     
  
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
        <div className="fixed bottom-4 left-4 z-20">
        <HelpCircle
          data-testid="open-help-menu"
          className="text-white cursor-pointer transform transition-transform duration-300 hover:scale-110 z-20"
          size={24}
          onClick={toggleHelpMenu}
        />
      </div>
  
      {isHelpOpen && (
        <div
          data-testid="help"
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
        >
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative">
            <button
              data-testid="close-help-menu"
              className="absolute top-2 right-2 text-gray-700"
              onClick={toggleHelpMenu}
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Help Menu</h2>
            <p>This dashboard allows you to:</p>
            <ul className="list-disc list-inside">
              <li>View all tickets submitted within your municipality.</li>
              <li>Sort tickets by different criteria such as urgency, ticket number, or status.</li>
              <li>Create new tickets directly from this dashboard.</li>
              <li>Refresh the data to see the most up-to-date information.</li>
            </ul>
            <p>
              Use the dropdown menu to sort tickets, and click on any ticket to view more details or take action.
            </p>
          </div>
        </div>
      )}
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
          <NavbarMunicipality unreadNotifications={unreadNotifications} />
          <main className="p-8 relative">
            <div className="flex items-center mb-2 mt-2 ml-2">
              <h1 className="text-4xl font-bold text-white text-opacity-80">
                Dashboard
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center text-white text-opacity-80">
              <div className="w-12 h-12 mb-2 bg-gray-300 flex items-center justify-center rounded-full overflow-hidden">
              <img
                src={String(muniprofile)}
                alt="Description of image"
                width={20}
                height={20}
                className="w-full h-full object-cover"
              />
              </div>
              {cityLoading ? (
                <ThreeDots
                  height="40"
                  width="80"
                  radius="9"
                  color="#ADD8E6"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              ) : (
                <span className="text-xl font-bold">{city}</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-8">
              <div className="relative inline-block text-left">
                <button
                  className="flex items-center text-white text-opacity-80 hover:bg-gray-600 px-4 py-2 rounded transform transition-transform duration-200 hover:scale-105"
                  onClick={toggleDropdown}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
                >
                  <span>Issues ordered by:</span>
                  <ChevronDown className="ml-2" size={16} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {[
                        "Urgency",
                        "Ticket Number",
                        "Fault Type",
                        "Status",
                        "Created By",
                        "Address",
                      ].map((field) => (
                        <a
                          key={field}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {field}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full fixed bottom-10 right-10 shadow-lg z-20"
                onClick={() =>
                  (window.location.href = "/create-ticket/municipality")
                }
              >
                + Report Fault
              </button>
            </div>
            <div className="mt-8">
              {tableLoading ? (
                <div className="flex justify-center items-center h-64">
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
                <RecordsTable records={dashMuniResults} refresh={fetchData} />
              )}
            </div>
          </main>
        </div>
      </div>
  
      {/* Mobile View */}
      <div className="block sm:hidden">
        <NavbarMunicipality unreadNotifications={unreadNotifications} />
        <NavbarMobile />
  
        {/* Background Image */}
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
            zIndex: -1,
          }}
        ></div>
  
        <main className="relative z-10 p-4 pb-16">
          <h1 className="text-3xl font-bold text-white text-opacity-80 text-center mb-4">
            Dashboard
          </h1>
  
          {/* City Information */}
          <div className="flex flex-col items-center justify-center text-white text-opacity-80 mb-6">
            <div className="w-12 h-12 bg-gray-300 flex items-center justify-center rounded-full overflow-hidden mb-4">
              <ImageIcon size={20} className="text-gray-500" />
            </div>
            {cityLoading ? (
              <ThreeDots
                height="40"
                width="80"
                radius="9"
                color="#ADD8E6"
                ariaLabel="three-dots-loading"
                visible={true}
              />
            ) : (
              <span className="text-xl font-bold">{city}</span>
            )}
          </div>
  
          {/* Dropdown and Report Fault Button */}
          <div className="flex items-center justify-between mt-6">
            <div className="relative inline-block text-left">
              <button
                className="flex items-center text-white text-opacity-80 hover:bg-gray-600 px-4 py-2 rounded transform transition-transform duration-200 hover:scale-105"
                onClick={toggleDropdown}
                style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
              >
                <span>Issues ordered by:</span>
                <ChevronDown className="ml-2" size={16} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {[
                      "Urgency",
                      "Ticket Number",
                      "Fault Type",
                      "Status",
                      "Created By",
                      "Address",
                    ].map((field) => (
                      <a
                        key={field}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {field}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
  
          {/* Records Table */}
          <div className="mt-8 mb-4">
            {tableLoading ? (
              <div className="flex justify-center items-center h-64">
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
              <RecordsTable records={dashMuniResults} refresh={fetchData} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
  
}
