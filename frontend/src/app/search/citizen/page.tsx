"use client";

import React, { useState, useEffect, FormEvent, useRef } from "react";
import NavbarUser from "@/components/Navbar/NavbarUser";
import SearchTicket from "@/components/Search/SearchTicket";
import SearchMunicipality from "@/components/Search/SearchMunicipality";
import SearchSP from "@/components/Search/SearchSP";
import axios from "axios";
import { FaFilter } from "react-icons/fa";
import { HelpCircle, X } from "lucide-react";
import Modal from "react-modal";
import { ThreeDots } from "react-loader-spinner";

export default function CreateTicket() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "myLocation" | "serviceProviders" | "municipalities"
  >("myLocation");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [municipalityTickets, setMunicipalityTickets] = useState<any[]>([]);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setHasSearched(true);
      setLoading(true);
      let response = { data: [] };
      switch (selectedFilter) {
        case "myLocation":
          response = await axios.get(
            `https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/search/issues?q=${encodeURIComponent(
              searchTerm
            )}`
          );
          break;
        case "serviceProviders":
          response = await axios.get(
            `https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/search/service-provider?q=${encodeURIComponent(
              searchTerm
            )}`
          );
          break;
        case "municipalities":
          response = await axios.get(
            `https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/search/municipality?q=${encodeURIComponent(
              searchTerm
            )}`
          );
          const municipalityIds = response.data.map(
            (municipality: any) => municipality.municipality_id
          );
          const ticketsPromises = municipalityIds.map(
            (municipalityId: string) =>
              axios.get(
                `https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/search/municipality-tickets?q=${encodeURIComponent(
                  municipalityId
                )}`
              )
          );
          const ticketsResponses = await Promise.all(ticketsPromises);
          const allTickets = ticketsResponses.flatMap(
            (response) => response.data
          );
          setMunicipalityTickets(allTickets);
          break;
        default:
          break;
      }
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (
    filter: "myLocation" | "serviceProviders" | "municipalities"
  ) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
    setSearchResults([]);
    setHasSearched(false);
    setMunicipalityTickets([]);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSearch();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <NavbarUser />
      <main>
        <div className="flex items-center mb-2 mt-2 ml-2">
          <h1 className="text-4xl font-bold">Search</h1>
          <button
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <HelpCircle size={24} />
          </button>
        </div>

        {isHelpModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative">
              <button
                className="absolute top-2 right-2 text-gray-700"
                onClick={() => setIsHelpModalOpen(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4">Help Menu</h2>
              <p>This page allows you to:</p>
              <ul className="list-disc list-inside">
                <li>
                  Search for tickets based on different criteria such as
                  location, service providers, or municipalities.
                </li>
                <li>
                  Use the filter button to select your preferred search
                  criterion.
                </li>
                <li>
                  Type your search term and press the search button or Enter key
                  to get the results.
                </li>
              </ul>
              <p>
                Use the search bar and filter options to find the information
                you need.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center mb-4">
          <span className="text-xl text-gray-700 mb-2 font-bold">
            Search for anything...
          </span>
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-md"
          >
            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  className="w-full p-2 pr-20 border border-gray-300 rounded-md"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <FaFilter />
                </button>
              </div>
              <button
                type="submit"
                className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Search
              </button>
            </div>
            {isFilterOpen && (
              <div
                ref={filterRef}
                className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10"
              >
                {["myLocation", "municipalities", "serviceProviders"].map(
                  (filter) => (
                    <div
                      key={filter}
                      className={`p-2 cursor-pointer ${
                        selectedFilter === filter
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        handleFilterChange(
                          filter as
                            | "myLocation"
                            | "serviceProviders"
                            | "municipalities"
                        )
                      }
                    >
                      {filter === "myLocation"
                        ? "Current Municipality"
                        : filter === "municipalities"
                        ? "Municipality Tickets"
                        : "Company"}
                    </div>
                  )
                )}
              </div>
            )}
          </form>
          <span className="text-sm text-gray-500 mt-2">
            Filtering by:{" "}
            {selectedFilter === "myLocation"
              ? "Current Municipality"
              : selectedFilter === "municipalities"
              ? "Municipality Tickets"
              : "Company"}
          </span>
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-8">
            {" "}
            {/* Adjusted margin-top */}
            <ThreeDots
              height="40"
              width="80"
              radius="9"
              color="#ADD8E6" // Changed to a lighter blue
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        )}
        {!loading && hasSearched && searchResults.length === 0 && (
          <div className="flex justify-center items-center mt-4">
            <p className="text-gray-500 mt-16">
              No results found. Please try a different search term.
            </p>
          </div>
        )}

        {hasSearched && !loading && (
          <>
            {selectedFilter === "serviceProviders" && (
              <SearchSP serviceProviders={searchResults} />
            )}
            {selectedFilter === "municipalities" && (
              <>
                <SearchMunicipality municipalities={searchResults} />
                <SearchTicket tickets={municipalityTickets} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
