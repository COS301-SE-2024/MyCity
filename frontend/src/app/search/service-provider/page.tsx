"use client";

import React, { useState, FormEvent } from "react";
import NavbarCompany from "@/components/Navbar/NavbarCompany";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import SearchMunicipality from "@/components/Search/SearchMunicipality";
import SearchSP from "@/components/Search/SearchSP";
import { HelpCircle, X } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";
import {
  searchMunicipality,
  searchServiceProvider,
} from "@/services/search.service";
import { useProfile } from "@/hooks/useProfile";

export default function CreateTicket() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "serviceProviders" | "municipalities"
  >("serviceProviders");
  const [hasSearched, setHasSearched] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [searchTime, setSearchTime] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const { getUserProfile } = useProfile();

  const handleSearch = async () => {
    const userProfile = await getUserProfile();
    const sessionToken = userProfile.current?.session_token;

    try {
      setHasSearched(true);
      setLoading(true);
      const startTime = Date.now();
      let data: any[] = [];
      switch (selectedFilter) {
        case "serviceProviders":
          data = await searchServiceProvider(sessionToken, searchTerm);
          break;
        case "municipalities":
          data = await searchMunicipality(sessionToken, searchTerm);
          break;
        default:
          break;
      }
      const endTime = Date.now();
      setSearchTime((endTime - startTime) / 1000); // Time in seconds
      setTotalResults(data.length);
      setSearchResults(data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (
    filter: "serviceProviders" | "municipalities"
  ) => {
    setSelectedFilter(filter);
    setSearchResults([]);
    setHasSearched(false);
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
    if (event.key === "Enter" && searchTerm.trim().length > 0) {
      handleSearch();
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = Array.isArray(searchResults)
    ? searchResults.slice(indexOfFirstResult, indexOfLastResult)
    : [];

  const unreadNotifications = 74;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <NavbarCompany unreadNotifications={unreadNotifications} />
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
          <div className="relative pt-8">
            <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
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
                  <li>Search for service providers or municipalities.</li>
                  <li>
                    Use the filter button to select your preferred search
                    criterion.
                  </li>
                  <li>
                    Type your search term and press the search button or Enter
                    key to get the results.
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
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-md"
            >
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <input
                    data-testid="searchbox"
                    type="text"
                    className="w-full p-2 pr-20 border border-gray-300 rounded-full"
                    placeholder="Type to search..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button
                  data-testid="search-btn"
                  type="submit"
                  disabled={searchTerm.trim().length === 0}
                  className={`ml-2 px-3 py-2 rounded-full transition duration-300 ${
                    searchTerm.trim().length > 0
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex mt-4 relative">
              {["municipalities", "serviceProviders"].map((filter) => (
                <div
                  key={filter}
                  className={`px-4 py-2 mx-1 cursor-pointer rounded-full transition duration-300 ${
                    selectedFilter === filter
                      ? "bg-gray-500 text-white"
                      : "bg-transparent text-white"
                  }`}
                  onClick={() =>
                    handleFilterChange(
                      filter as "municipalities" | "serviceProviders"
                    )
                  }
                >
                  {filter === "municipalities"
                    ? "Municipalities"
                    : "Service Providers"}
                </div>
              ))}
            </div>
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
                  return (
                    <SearchMunicipality
                      key={index}
                      municipalities={[result]}
                    />
                  );
                }
                return null;
              })}

              {/* Only show pagination if there are results */}
              {searchResults.length > 0 && (
                <div className="flex justify-between mt-4 text-white">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className={`px-48 py-2 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of{" "}
                    {Math.ceil(searchResults.length / resultsPerPage)}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className={`px-48 py-2 ${
                      currentPage ===
                      Math.ceil(searchResults.length / resultsPerPage)
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    disabled={
                      currentPage ===
                      Math.ceil(searchResults.length / resultsPerPage)
                    }
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {showToast && (
            <div className="fixed bottom-4 left-4 bg-white text-black px-4 py-2 rounded-3xl shadow-lg">
              <span>{totalResults} results found in </span>
              <span className="text-blue-500">{searchTime.toFixed(2)}</span>
              <span> seconds</span>
            </div>
          )}
        </main>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <NavbarMobile />
        <NavbarCompany unreadNotifications={unreadNotifications} />
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

        <main className="relative z-10 p-4">
          <h1 className="text-3xl font-bold text-white text-opacity-80 text-center mb-4">
            Search
          </h1>

          {/* Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-sm mx-auto"
          >
            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  data-testid="searchbox-mobile"
                  type="text"
                  className="w-full p-2 pr-16 border border-gray-300 rounded-full"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                data-testid="search-btn-mobile"
                type="submit"
                disabled={searchTerm.trim().length === 0}
                className={`ml-2 px-3 py-2 rounded-full transition duration-300 ${
                  searchTerm.trim().length > 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Buttons */}
          <div className="flex justify-center mt-4">
            {["municipalities", "serviceProviders"].map((filter) => (
              <div
                key={filter}
                className={`px-4 py-2 mx-1 cursor-pointer rounded-full transition duration-300 text-center ${
                  selectedFilter === filter
                    ? "bg-gray-500 text-white"
                    : "bg-transparent text-white"
                }`}
                onClick={() =>
                  handleFilterChange(
                    filter as "municipalities" | "serviceProviders"
                  )
                }
              >
                {filter === "municipalities"
                  ? "Municipalities"
                  : "Service Providers"}
              </div>
            ))}
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
                  return (
                    <SearchMunicipality
                      key={index}
                      municipalities={[result]}
                    />
                  );
                }
                return null;
              })}

              {/* Pagination Controls */}
              {searchResults.length > 0 && (
                <div className="flex justify-between mt-4 text-white mb-16">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className={`px-4 py-2 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of{" "}
                    {Math.ceil(searchResults.length / resultsPerPage)}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className={`px-4 py-2 ${
                      currentPage ===
                      Math.ceil(searchResults.length / resultsPerPage)
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    disabled={
                      currentPage ===
                      Math.ceil(searchResults.length / resultsPerPage)
                    }
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

{showToast && (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-3xl shadow-lg">
    <span>{totalResults} results found in </span>
    <span className="text-blue-500">{searchTime.toFixed(2)}</span>
    <span> seconds</span>
  </div>
)}

        </main>
      </div>
    </>
  );
}
