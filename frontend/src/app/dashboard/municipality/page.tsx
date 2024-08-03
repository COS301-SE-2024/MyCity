"use client";

import { useState } from "react";
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import RecordsTable from "@/components/RecordsTable/RecordsTable";
import { Building, ChevronDown } from "lucide-react";

export default function Dashboard() {
  const [city, setCity] = useState("City of Ekurhuleni");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
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
          <NavbarMunicipality />
          <main className="p-8 relative">
            <div className="flex items-center mb-2 mt-2 ml-2">
              <h1 className="text-4xl font-bold text-white text-opacity-80">
                Dashboard
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center text-white text-opacity-80">
              <Building size={30} className="mb-2" />
              <span className="text-xl">{city}</span>
            </div>
            <div className="flex items-center justify-between mt-8">
              <div className="relative inline-block text-left">
                <button
                  className="flex items-center text-white text-opacity-80 hover:bg-gray-600 px-4 py-2 rounded transform transition-transform duration-200 hover:scale-105"
                  onClick={toggleDropdown}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0)" }} // Transparent background
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full fixed bottom-10 right-10 shadow-lg"
                onClick={() =>
                  (window.location.href = "/create-ticket/municipality")
                }
              >
                + New Ticket
              </button>
            </div>
            <div className="mt-8">
              <RecordsTable />
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


        </div>
      </div>
    </div>
  );
}
