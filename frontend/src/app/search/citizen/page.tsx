'use client'

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import NavbarUser from '@/components/Navbar/NavbarUser';
import SearchTicket from '@/components/Search/SearchTicket';
import SearchMunicipality from '@/components/Search/SearchMunicipality';
import SearchSP from '@/components/Search/SearchSP';
import axios from 'axios';
import { FaFilter } from 'react-icons/fa';

export default function CreateTicket() {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]); // Define the type according to your API response
  const [selectedFilter, setSelectedFilter] = useState<'myLocation' | 'serviceProviders' | 'municipalities'>('myLocation');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    try {
      let response = { data: [] }; // Initialize with an empty array or appropriate default value
      switch (selectedFilter) {
        case 'myLocation':
          response = await axios.get(`https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/search/issues?q=${encodeURIComponent(searchTerm)}`);
          break;
        case 'serviceProviders':
          response = await axios.get(`https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/search/service-providers?q=${encodeURIComponent(searchTerm)}`);
          break;
        case 'municipalities':
          response = await axios.get(`https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/search/municipality?q=${encodeURIComponent(searchTerm)}`);
          break;
        default:
          break;
      }
      setSearchResults(response.data); // Assuming your API returns an array of search results
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleFilterChange = (filter: 'myLocation' | 'serviceProviders' | 'municipalities') => {
    setSelectedFilter(filter);
    setIsFilterOpen(false); // Close the filter dropdown after selection
    //setSearchTerm(''); // Clear the search term when changing filters
    setSearchResults([]); // Clear previous search results
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  //Additional button handling to submit the query
  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault(); // Prevent form submission
    handleSearch(); // Trigger search function
  };

  //To be able to handle a query via user pressing enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger search function when Enter key is pressed
    }
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


    return (
        <div>
          <NavbarUser />
          <main>
            <h1 className="text-4xl font-bold mb-2 mt-2 ml-2">
              Search
            </h1>
    
            <div className="flex flex-col items-center mb-4">
              <span className="text-xl text-gray-700 mb-2 font-bold">Search for anything...</span>
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
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
                  <div ref={filterRef} className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {['myLocation', 'municipalities', 'serviceProviders'].map((filter) => (
                      <div 
                        key={filter}
                        className={`p-2 cursor-pointer ${selectedFilter === filter ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                        onClick={() => handleFilterChange(filter as 'myLocation' | 'serviceProviders' | 'municipalities')}
                      >
                        {filter === 'myLocation' ? 'Current Municipality' :
                        filter === 'municipalities' ? 'Municipality Tickets' :
                        'Company'}
                      </div>
                    ))}
                  </div>
                )}
              </form>
              <span className="text-sm text-gray-500 mt-2">
                Filtering by: {
                  selectedFilter === 'myLocation' ? 'Current Municipality' :
                  selectedFilter === 'municipalities' ? 'Municipality Tickets' :
                  'Company'
                }
              </span>
            </div>
    
            <SearchTicket />
            <SearchMunicipality />
            <SearchSP />
          </main>
        </div>
      );
    };
