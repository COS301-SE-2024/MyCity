"use client";

import React, { useEffect, useState } from "react";
import { getMunicipalityList } from "@/services/municipalities.service";

interface MunicipalitySelectorProps {
  selectedMunicipality: string;
  setSelectedMunicipality: (value: string) => void;
}

export default function MunicipalitySelector({
  selectedMunicipality,
  setSelectedMunicipality,
}: MunicipalitySelectorProps) {
  const [municipalities, setMunicipalities] = useState<any[]>([]);

  useEffect(() => {
    const fetchMunicipalityList = async () => {
      const list = await getMunicipalityList();
      // Sort the list by municipality_id (or municipality_name if available)
      const sortedList = list.sort((a, b) => 
        a.municipality_id.localeCompare(b.municipality_id)
      );
      console.log(sortedList); // Log the sorted list
      setMunicipalities(sortedList);
    };

    fetchMunicipalityList();
  }, []);

  return (
    <div className="flex items-center w-full">
      <label className="text-white text-xl w-[40%] mr-4 text-right">
        Select Municipality:
      </label>
      <select
        value={selectedMunicipality}
        onChange={(e) => setSelectedMunicipality(e.target.value)}
        className="p-2 w-[60%] rounded-md bg-white bg-opacity-90 text-black"
      >
        {municipalities.map((mun, index) => (
          <option key={index} value={mun.municipality_id}>
            {mun.municipality_id}
          </option>
        ))}
      </select>
    </div>
  );
}
