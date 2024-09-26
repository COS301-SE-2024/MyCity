"use client"

import React, { useState, FormEvent } from "react";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import SearchTicket from "@/components/Search/SearchTicket";
import SearchMunicipality from "@/components/Search/SearchMunicipality";
import SearchSP from "@/components/Search/SearchSP";
import { HelpCircle, X } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";
import { useProfile } from "@/hooks/useProfile";
import {
  searchIssue,
  searchMunicipality,
  searchMunicipalityTickets,
  searchServiceProvider,
} from "@/services/search.service";

export default function CreateTicket() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "myMunicipality" | "serviceProviders" | "municipalities"
  >("myMunicipality");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [searchTime, setSearchTime] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedSubfilter, setSelectedSubfilter] = useState(0);
  const userProfile = useProfile();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleSearch = async () => {
    // Prevent searching if the search term is empty
    if (searchTerm.trim() === "") return;

    try {
      setHasSearched(true);
      setLoading(true);
      const startTime = Date.now();
      let data: any[] = [];

      const user_data = await userProfile.getUserProfile();
      const user_municipality = String(user_data.current?.municipality);
      const sessionToken = String(user_data.current?.session_token);

      switch (selectedFilter) {
        case "myMunicipality":
          if (selectedSubfilter === 0) {
            data = await searchMunicipalityTickets(
              sessionToken,
              user_municipality
            );
          } else if (selectedSubfilter === 1) {
            data = await searchMunicipalityTickets(
              sessionToken,
              user_municipality
            );
          }
          break;
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
      setSearchTime((endTime - startTime) / 1000);
      setTotalResults(data.length);
      setSearchResults(data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (
    filter: "myMunicipality" | "serviceProviders" | "municipalities"
  ) => {
    setSelectedFilter(filter);
    setSelectedSubfilter(0);
    setSearchResults([]);
    setHasSearched(false);
    setCurrentPage(1);
  };

  const handleSubfilterChange = (index: number) => {
    setSelectedSubfilter(index);
    handleSearch();
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

  const handleNextPage = () => {
    const totalPages = Math.ceil(searchResults.length / resultsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = Array.isArray(searchResults)
    ? searchResults.slice(indexOfFirstResult, indexOfLastResult)
    : [];

  const unreadNotifications = Math.floor(Math.random() * 10) + 1;

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
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
                  <li>
                    Search for tickets based on different criteria such as
                    location, service providers, or municipalities.
                  </li>
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
                  className={`ml-2 px-3 py-2 rounded-full transition duration-300 ${
                    searchTerm.trim() === ""
                      ? "bg-gray-400 text-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={searchTerm.trim() === ""}
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex mt-4 relative">
              {["myMunicipality", "municipalities", "serviceProviders"].map(
                (filter) => (
                  <div
                    key={filter}
                    className={`px-4 py-2 mx-1 cursor-pointer rounded-full transition duration-300 ${
                      selectedFilter === filter
                        ? "bg-gray-500 text-white"
                        : "bg-transparent text-white"
                    }`}
                    onClick={() =>
                      handleFilterChange(
                        filter as
                          | "myMunicipality"
                          | "municipalities"
                          | "serviceProviders"
                      )
                    }
                  >
                    {filter === "myMunicipality"
                      ? "My Municipality"
                      : filter === "municipalities"
                      ? "Municipalities"
                      : "Service Providers"}
                  </div>
                )
              )}
            </div>
            {selectedFilter === "myMunicipality" && (
              <div className="flex mt-6">
                {["Near Me", "Asset"].map((subfilter, index) => (
                  <div
                    key={subfilter}
                    className={`px-3 py-1 mx-1 cursor-pointer rounded-full transition duration-300 ${
                      selectedSubfilter === index
                        ? "bg-gray-500 text-white"
                        : "bg-transparent text-gray-300 border border-gray-300"
                    }`}
                    onClick={() => handleSubfilterChange(index)}
                  >
                    {subfilter}
                  </div>
                ))}
              </div>
            )}
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

          {hasSearched && !loading && searchResults.length > 0 && (
            <>
              {currentResults.map((result, index) => {
                if (selectedFilter === "serviceProviders") {
                  return <SearchSP key={index} serviceProviders={[result]} />;
                }
                if (selectedFilter === "municipalities") {
                  return (
                    <SearchMunicipality key={index} municipalities={[result]} />
                  );
                }
                if (selectedFilter === "myMunicipality") {
                  return <SearchTicket key={index} tickets={[result]} municipalities={[result]} />;
                }
                return null;
              })}
              <div className="flex justify-between mt-4 text-white">
                <button
                  onClick={handlePrevPage}
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
                  onClick={handleNextPage}
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
            </>
          )}
          {showToast && totalResults > 0 && (
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

        {/* Main Search Section */}
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
                className={`ml-2 px-3 py-2 rounded-full transition duration-300 ${
                  searchTerm.trim() === ""
                    ? "bg-gray-400 text-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={searchTerm.trim() === ""}
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Buttons */}
          <div className="flex justify-center mt-4">
            {["myMunicipality", "municipalities", "serviceProviders"].map(
              (filter) => (
                <div
                  key={filter}
                  className={`px-4 py-2 mx-1 cursor-pointer rounded-full transition duration-300 text-center ${
                    selectedFilter === filter
                      ? "bg-gray-500 text-white"
                      : "bg-transparent text-white"
                  } flex items-center justify-center`} // Removed the white border
                  onClick={() => handleFilterChange(filter as any)}
                >
                  {filter === "myMunicipality"
                    ? "My Municipality"
                    : filter === "municipalities"
                    ? "Municipalities"
                    : "Service Providers"}
                </div>
              )
            )}
          </div>

          {/* Subfilters (for My Municipality only) */}
          {selectedFilter === "myMunicipality" && (
            <div className="flex justify-center mt-4">
              {["Near Me", "Asset"].map((subfilter, index) => (
                <div
                  key={subfilter}
                  className={`px-3 py-1 mx-1 cursor-pointer rounded-full transition duration-300 text-center ${
                    selectedSubfilter === index
                      ? "bg-gray-500 text-white"
                      : "bg-transparent text-gray-300 border border-gray-300"
                  }`}
                  onClick={() => handleSubfilterChange(index)}
                >
                  {subfilter}
                </div>
              ))}
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center mt-8">
              <ThreeDots
                height="40"
                width="80"
                color="#ADD8E6"
                ariaLabel="three-dots-loading"
                visible={true}
              />
            </div>
          )}

          {/* No Results */}
          {!loading && hasSearched && searchResults.length === 0 && (
            <div className="flex justify-center items-center mt-4">
              <p className="mt-16 text-white text-opacity-80">
                No results found. Please try a different search term.
              </p>
            </div>
          )}

          {/* Display Search Results */}
          {hasSearched && !loading && searchResults.length > 0 && (
            <>
              {currentResults.map((result, index) => {
                // Use the original backend filters in the logic
                if (selectedFilter === "serviceProviders") {
                  return <SearchSP key={index} serviceProviders={[result]} />;
                }
                if (selectedFilter === "municipalities") {
                  return (
                    <SearchMunicipality key={index} municipalities={[result]} />
                  );
                }
                if (selectedFilter === "myMunicipality") {
                  return <SearchTicket key={index} tickets={[result]} municipalities={result} />;
;
                }
                return null;
              })}

              {/* Pagination Controls */}
              <div className="flex justify-between mt-4 text-white mb-16">
                <button
                  onClick={handlePrevPage}
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
                  onClick={handleNextPage}
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
            </>
          )}

          {/* Toast Notification */}
          {showToast && totalResults > 0 && (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-3xl shadow-lg">
    <span>{totalResults} results found in </span>
    <span className="text-blue-500">{searchTime.toFixed(2)}</span>
    <span> seconds</span>
  </div>
)}

        </main>
      </div>
    </div>
  );
}
