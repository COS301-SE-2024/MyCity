"use client";

import React, { useState, useEffect, FormEvent } from "react";
import NavbarUser from "@/components/Navbar/NavbarUser";
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
    try {
      setHasSearched(true);
      setLoading(true);
      const startTime = Date.now();
      let data: any[] = [];

      // Get user profile and municipality
      const user_data = await userProfile.getUserProfile();
      const user_municipality = String(user_data.current?.municipality);
      const user_session = String(user_data.current?.session_token);

      switch (selectedFilter) {
        case "myMunicipality": // My Municipality -> Near Me or Asset
          if (selectedSubfilter === 0) {
            data = await searchMunicipalityTickets(user_municipality); //User's municipality tickets
          } else if (selectedSubfilter === 1) {
            data = await searchIssue(searchTerm + ` ${user_municipality}`); //Filter of the above tickets based on potential asset matches
          }
          break;
        case "serviceProviders": // Service Providers
          data = await searchServiceProvider(searchTerm);
          break;
        case "municipalities": // Municipalities
          data = await searchMunicipality(searchTerm);
          break;
        default:
          break;
      }

      console.log('Checking to see array output');
      console.log('API Response Data:', data);

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
    filter: "myMunicipality" | "serviceProviders" | "municipalities"
  ) => {
    setSelectedFilter(filter);
    setSelectedSubfilter(0); // Reset subfilter to default
    setSearchResults([]);
    setHasSearched(false);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const handleSubfilterChange = (index: number) => {
    setSelectedSubfilter(index);
    handleSearch(); // Trigger a search whenever the subfilter changes
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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <NavbarUser />
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
                      Type your search term and press the search button or Enter
                      key to get the results.
                    </li>
                  </ul>
                  <p>
                    Use the search bar and filter options to find the
                    information you need.
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
                    className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
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

            {loading ? (
              <div className="flex justify-center items-center mt-4">
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="white"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  visible={true}
                />
              </div>
            ) : hasSearched && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {currentResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white bg-opacity-80 rounded-lg shadow-md"
                  >
                    {selectedFilter === "myMunicipality" && (
                      <SearchTicket tickets={result} />
                    )}
                    {selectedFilter === "municipalities" && (
                      <SearchMunicipality municipalities={result} />
                    )}
                    {selectedFilter === "serviceProviders" && (
                      <SearchSP serviceProviders={result} />
                    )}
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="flex justify-center items-center mt-4">
                <p className="text-white text-opacity-80">
                  No results found for "{searchTerm}".
                </p>
              </div>
            ) : (
              <div className="flex justify-center items-center mt-4">
                <p className="text-white text-opacity-80">
                  Please enter a search term to begin.
                </p>
              </div>
            )}

            <div className="flex justify-center mt-4">
              {Array.from({
                length: Math.ceil(searchResults.length / resultsPerPage),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 mx-1 rounded-full transition duration-300 ${
                    currentPage === index + 1
                      ? "bg-gray-500 text-white"
                      : "bg-transparent text-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div
              className={`fixed bottom-4 left-4 bg-green-500 text-white p-3 rounded-lg shadow-lg transition-opacity duration-300 ${
                showToast ? "opacity-100" : "opacity-0"
              }`}
            >
              <p>
                Found {totalResults} results in {searchTime.toFixed(2)} seconds.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
