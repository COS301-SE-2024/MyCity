import { useMapbox } from "@/hooks/useMapbox";
import { useProfile } from "@/hooks/useProfile";
import { getTicketsGeoData } from "@/services/tickets.service";
import { useEffect, useRef, useState } from "react";
import { Rings } from "react-loader-spinner"; // Importing the Rings loader

export default function FaultMapView() {
  const faultMapContainer = useRef<HTMLDivElement>(null);
  const { initialiseFaultMap } = useMapbox();
  const { getUserProfile } = useProfile();
  const [faultCount, setFaultCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaultMap = async () => {
      setLoading(true);
      const userProfile = await getUserProfile();
      const sessionToken = userProfile.current?.session_token;

      const faultGeodata = await getTicketsGeoData(sessionToken);

      if (faultMapContainer.current) {
        await initialiseFaultMap(faultMapContainer, faultGeodata, userProfile.current?.municipality);
      }

      if (Array.isArray(faultGeodata)) {
        setFaultCount(faultGeodata.length);
      } else {
        setFaultCount(0); // If no faults or an error occurs
      }
      setLoading(false);
    };

    loadFaultMap();
  }, []);
  // }, [getUserProfile, initialiseFaultMap]);

  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="flex flex-col md:flex-row w-full max-w-7xl h-[40rem] bg-white bg-opacity-80 rounded-lg shadow-lg overflow-hidden">
        {/* Key Section */}
        <div className="w-full md:w-1/6 p-6 bg-white bg-opacity-80 flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-4 text-center">Key</h2>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 rounded-full bg-red-700 mr-4"></div>
            <span className="text-lg">Urgent</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 rounded-full bg-yellow-600 mr-4"></div>
            <span className="text-lg">Semi-urgent</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 rounded-full bg-green-700 mr-4"></div>
            <span className="text-lg">Non-urgent</span>
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-lg font-bold">Faults Pinned</h2>
            {loading ? (
              <div className="flex justify-center">
                <Rings color="#000000" height={40} width={40} />
              </div>
            ) : (
              <p className="text-lg font-bold">{faultCount}</p>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full md:w-5/6 flex-grow">
          <div className="relative w-full h-full rounded-lg bg-gray-200" ref={faultMapContainer}></div>
        </div>
      </div>
    </div>
  );
}
