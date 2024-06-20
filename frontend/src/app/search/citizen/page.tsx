'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import NavbarUser from '@/components/Navbar/NavbarUser';
import SearchTicket from '@/components/Search/SearchTicket';
import SearchMunicipality from '@/components/Search/SearchMunicipality';
import SearchSP from '@/components/Search/SearchSP';
import axios from 'axios';

export default function CreateTicket() {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]); // Define the type according to your API response
  const [selectedFilter, setSelectedFilter] = useState<'myLocation' | 'serviceProviders' | 'municipalities'>('myLocation');

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


    return (
        <div>
          <NavbarUser />
          <main>
            <h1 className="text-4xl font-bold mb-2 mt-2 ml-2">
              Search
            </h1>
    
            <div className="flex flex-col items-center mb-4">
              <span className="text-xl text-gray-700 mb-2 font-bold">Search for anything...</span>
              <input 
                type="text" 
                className="w-full max-w-md p-2 border border-gray-300 rounded-md mb-2" 
                placeholder="Type to search..."
              />
              <span className="text-sm text-gray-500">3 search results</span>
            </div>
    
            <SearchTicket />
            <SearchMunicipality />
            <SearchSP />
          </main>
        </div>
      );
    };
