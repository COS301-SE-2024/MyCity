'use client'

import React from 'react';
import NavbarUser from '@/components/Navbar/NavbarUser';
import SearchTicket from '@/components/Search/SearchTicket';
import SearchMunicipality from '@/components/Search/SearchMunicipality';
import SearchSP from '@/components/Search/SearchSP';

export default function CreateTicket() {

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
