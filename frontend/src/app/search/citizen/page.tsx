"use client";

import React, { useState, useEffect, FormEvent, useRef } from "react";
import Navbar from "@/components/Navbar/Navbar";
import SearchTicket from "@/components/Search/SearchTicket";
import SearchMunicipality from "@/components/Search/SearchMunicipality";
import SearchSP from "@/components/Search/SearchSP";
import { FaFilter } from "react-icons/fa";
import { HelpCircle, X } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";
import { searchIssue, searchMunicipality, searchMunicipalityTickets, searchServiceProvider } from "@/services/search.service";

export default function CreateTicket() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "myLocation" | "serviceProviders" | "municipalities" | "municipalityTickets"
  >("myLocation");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [municipalityTickets, setMunicipalityTickets] = useState<any[]>([]);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [searchTime, setSearchTime] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async () => {
    try {
      setHasSearched(true);
      setLoading(true);
      const startTime = Date.now();
      let data: any[] = [];
      let allTickets = [];
      switch (selectedFilter) {
        case "myLocation":
          data = await searchIssue(searchTerm);
          break;
        case "serviceProviders":
          data = await searchServiceProvider(searchTerm);
          break;
        case "municipalities":
          data = await searchMunicipality(searchTerm);
          break;
        case "municipalityTickets":
          data = await searchMunicipality(searchTerm);
          const municipalityIds = data.map(
            (municipality: any) => municipality.municipality_id
          );
          const ticketsPromises = municipalityIds.map(
            (municipalityId: string) => searchMunicipalityTickets(municipalityId)
          );
          const ticketsResponses = await Promise.all(ticketsPromises);
          allTickets = ticketsResponses.flatMap(
            (response) => response
          );
          setMunicipalityTickets(allTickets);
          break;
        default:
          break;
      }
      const endTime = Date.now();
      setSearchTime((endTime - startTime) / 1000); // Time in seconds
      setTotalResults(selectedFilter === "municipalityTickets" ? allTickets.length : data.length);
      setSearchResults(selectedFilter === "municipalityTickets" ? allTickets : data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (
    filter: "myLocation" | "serviceProviders" | "municipalities" | "municipalityTickets"
  ) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
    setSearchResults([]);
    setHasSearched(false);
    setMunicipalityTickets([]);
    setCurrentPage(1); // Reset to the first page on filter change
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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

  return (
    <div>
      <Navbar />
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
      <main>
        <div className="flex items-center mb-2 mt-2 ml-2">
          <h1 className="text-4xl font-bold text-white text-opacity-80">
            Search
          </h1>
          <button
            className="ml-2 fixed bottom-4 right-4 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <HelpCircle size={24} data-testid="open-help-menu" />
          </button>
        </div>

        {isHelpModalOpen && (
          <div
            data-testid="help"
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
          >
            <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative">
              <button
                className="absolute top-2 right-2 text-gray-700"
                data-testid="close-help-menu"
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
          <span className="text-xl text-white text-opacity-80 mb-2 font-bold">
            Search for anything...
          </span>
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-md"
          >
            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  data-testid="searchbox"
                  type="text"
                  className="w-full p-2 pr-20 border border-gray-300 rounded-md"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  data-testid="filter"
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <FaFilter />
                </button>
              </div>
              <button
                data-testid="search-btn"
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
                {["myLocation", "municipalities", "municipalityTickets", "serviceProviders"].map(
                  (filter) => (
                    <div
                      key={filter}
                      className={`p-2 cursor-pointer ${selectedFilter === filter
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                        }`}
                      onClick={() =>
                        handleFilterChange(
                          filter as
                          | "myLocation"
                          | "municipalities"
                          | "municipalityTickets"
                          | "serviceProviders"
                        )
                      }
                    >
                      {filter === "myLocation"
                        ? "Current Municipality"
                        : filter === "municipalities"
                          ? "Municipalities"
                          : filter === "municipalityTickets"
                            ? "Municipality Tickets"
                            : "Service Providers"}
                    </div>
                  )
                )}
              </div>
            )}
          </form>
          <span className="text-sm text-white text-opacity-80 0 mt-2">
            Filtering by:{" "}
            {selectedFilter === "myLocation"
              ? "Current Municipality"
              : selectedFilter === "municipalities"
                ? "Municipalities"
                : selectedFilter === "municipalityTickets"
                  ? "Municipality Tickets"
                  : "Service Providers"}
          </span>
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-8">
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
        )}
        {!loading && hasSearched && searchResults.length === 0 && (
          <div className="flex justify-center items-center mt-4">
            <p className="mt-16 text-white text-opacity-80">
              No results found. Please try a different search term.
            </p>
          </div>
        )}

        {hasSearched && !loading && (
          <>
            {currentResults.map((result, index) => {
              if (selectedFilter === "serviceProviders") {
                return <SearchSP key={index} serviceProviders={[result]} />;
              }
              if (selectedFilter === "municipalities") {
                return <SearchMunicipality key={index} municipalities={[result]} />;
              }
              if (selectedFilter === "municipalityTickets") {
                return <SearchTicket key={index} tickets={[result]} />;
              }
              return null;
            })}
            <div className="flex justify-center mt-4">
              <nav>
                <ul className="flex list-none p-0">
                  {Array.from(
                    { length: Math.ceil(searchResults.length / resultsPerPage) },
                    (_, index) => (
                      <li key={index} className="mx-1">
                        <button
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-1 rounded ${currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300"
                            }`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            </div>
          </>
        )}
        {showToast && (
          <div className="fixed bottom-4 left-4 bg-white text-black px-4 py-2 rounded shadow-lg">
            <span>{totalResults} results found in </span>
            <span className="text-blue-500">{searchTime.toFixed(2)}</span>
            <span> seconds</span>
          </div>
        )}
      </main>
    </div>
  );
}
