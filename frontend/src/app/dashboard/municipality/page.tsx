'use client'

import { useState } from 'react';
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import RecordsTable from "@/components/RecordsTable/RecordsTable";
import { Building, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const [city, setCity] = useState("City of Ekurhuleni");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
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
              style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }} // Transparent background
            >
              <span>Issues ordered by:</span>
              <ChevronDown className="ml-2" size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {['Urgency', 'Ticket Number', 'Fault Type', 'Status', 'Created By', 'Address'].map(field => (
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
            onClick={() => window.location.href='/create-ticket/municipality'}
          >
            + New Ticket
          </button>
        </div>
        <div className="mt-8">
          <RecordsTable />
        </div>
      </main>
    </div>
  );
}
