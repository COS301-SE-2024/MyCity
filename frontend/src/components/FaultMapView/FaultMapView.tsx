import { useMapbox } from "@/hooks/useMapbox";
import { useProfile } from "@/hooks/useProfile";
import { getTicketsGeoData } from "@/services/tickets.service";
import { useEffect, useRef } from "react";

export default function FaultMapView() {
  const faultMapContainer = useRef<HTMLDivElement>(null);
  const { initialiseFaultMap } = useMapbox();

  const { getUserProfile } = useProfile();

  useEffect(() => {

    const loadFaultMap = async () => {
      const userProfile = await getUserProfile();
      const sessionToken = userProfile.current?.session_token;

      const faultGeodata = await getTicketsGeoData(sessionToken);

      if (faultMapContainer.current) {
        initialiseFaultMap(faultMapContainer, faultGeodata);
      }

    };

    loadFaultMap();
  }, [getUserProfile, initialiseFaultMap]);


  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Map Section */}
      <div className="md:w-1/2 lg:w-1/2 md:pr-4 flex-grow flex pl-2">
        <div className="relative w-full h-full rounded-lg shadow-md bg-gray-200" ref={faultMapContainer}></div>
      </div>

      {/* Key and Regional Summary Section */}
      <div className="md:w-1/2 lg:w-1/2 flex flex-col">
        <div className="bg-white p-4 rounded-lg shadow-md flex-grow bg-opacity-70 h-[27rem]">
          <h2 className="text-lg font-bold mb-2">Key</h2>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-red-700 mr-2"></div>
            <span>Urgent</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-yellow-600 mr-2"></div>
            <span>Semi-urgent</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-green-700 mr-2"></div>
            <span>Non-urgent</span>
          </div>
        </div>
        {/* <div className="bg-white p-4 rounded-lg shadow-md flex-grow bg-opacity-70">
          <h2 className="text-lg font-bold mb-2">Regional Summary</h2>
          <p className="mb-2">Population: ~ 2 million</p>
          <p className="mb-2">Infrastructure faults: 154</p>
          <p className="mb-2">Active Users: 15,029</p>
          <p className="mb-2">Active Service Providers: 453</p>
          <p className="mb-2">Municipality Rating (21): ★★★★☆</p>
        </div> */}
      </div>
    </div>
  );
};