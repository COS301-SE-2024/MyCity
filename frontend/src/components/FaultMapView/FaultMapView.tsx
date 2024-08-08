import { useMapbox } from "@/hooks/useMapbox";
import { useProfile } from "@/hooks/useProfile";
import { getTicketsGeoData } from "@/services/tickets.service";
import { FaultGeoData } from "@/types/custom.types";
import { useEffect, useRef } from "react";

export default function FaultMapView() {
  const faultMapContainer = useRef<HTMLDivElement>(null);
  const { faultMap, initialiseFaultMap } = useMapbox();

  const { getUserProfile } = useProfile();

  useEffect(() => {

    const loadFaultMap = async () => {
      const userProfile = await getUserProfile();
      const sessionToken = userProfile.current?.session_token;

      const faultGeodata = await getTicketsGeoData(sessionToken);
      const actualFaultGeodata: FaultGeoData[] = [];

      //copy half of the faults
      for (let i = 0; i < faultGeodata.length / 2; i++) {
        actualFaultGeodata.push(faultGeodata[i]);
      }

      if (faultMapContainer.current) {
        initialiseFaultMap(faultMapContainer, actualFaultGeodata);
      }

    };

    loadFaultMap();
  }, [getUserProfile, initialiseFaultMap]);


  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Map Section */}
      <div className="md:w-1/2 lg:w-1/2 md:pr-4 flex-grow flex pl-2">
        <div className="relative w-full h-full rounded-lg shadow-md" ref={faultMapContainer}></div>
      </div>

      {/* Key and Regional Summary Section */}
      <div className="md:w-1/2 lg:w-1/2 flex flex-col">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex-grow bg-opacity-70">
          <h2 className="text-lg font-bold mb-2">Key</h2>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>Urgent</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>Semi-urgent</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>Non-urgent</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded mr-2 bg-gray-500"></div>
            <span>Traffic Lights Out</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2 bg-gray-800"></div>
            <span>Power Outage</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex-grow bg-opacity-70">
          <h2 className="text-lg font-bold mb-2">Regional Summary</h2>
          <p className="mb-2">Population: ~ 2 million</p>
          <p className="mb-2">Infrastructure faults: 154</p>
          <p className="mb-2">Active Users: 15,029</p>
          <p className="mb-2">Active Service Providers: 453</p>
          <p className="mb-2">Municipality Rating (21): ★★★★☆</p>
        </div>
      </div>
    </div>
  );
};