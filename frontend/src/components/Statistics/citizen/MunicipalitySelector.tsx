'use client';

import React, { useEffect, useState } from 'react';
import { getMunicipalityList } from '@/services/municipalities.service';

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
      setMunicipalities(list);
    };

    fetchMunicipalityList();
  }, []);

  return (
    <div className="flex items-center w-full">
      <label className="text-white text-xl w-[40%] mr-4">Select Municipality:</label>
      <select
        value={selectedMunicipality}
        onChange={(e) => setSelectedMunicipality(e.target.value)}
        className="p-2 w-[60%] rounded-md bg-white text-black"
      >
        {municipalities.map((mun) => (
          <option key={mun.municipality_id} value={mun.municipality_id}>
            {mun.municipality_name}
          </option>
        ))}
      </select>
    </div>
  );
}
