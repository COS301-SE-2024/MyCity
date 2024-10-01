import { useMapbox } from "@/hooks/useMapbox";
import { useProfile } from "@/hooks/useProfile";
import { getTicketsGeoData } from "@/services/tickets.service";
import { FaultGeoData } from "@/types/custom.types";
import { set } from "date-fns";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner"; // Importing the Rings loader

const MapboxMap = dynamic(() => import("../MapboxMap/MapboxMap"), {
  ssr: false,
});

export default function FaultMapView() {
  const { getUserProfile } = useProfile();
  const [faultCount, setFaultCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { addFaultMarkers, mapInstance } = useMapbox();
  const [faultGeoData, setFaultGeoData] = useState<FaultGeoData[]>([]);

  useEffect(() => {
    const getFaultData = async () => {
      setLoading(true);
      const userProfile = await getUserProfile();
      const sessionToken = userProfile.current?.session_token;

      try {
        const data = await getTicketsGeoData(sessionToken);
        if (Array.isArray(data)) {
          setFaultCount(data.length);
          setFaultGeoData(data);
        } else {
          setFaultCount(0); // if no faults
        }
      } catch (error: any) {
        setFaultCount(0); // if an error occurs
      }
      setLoading(false);
    };

    getFaultData();
  }, []);

  useEffect(() => {
    const attachFaultMarkers = () => {
      if (mapInstance.current != null && faultGeoData.length > 0) {
        addFaultMarkers(faultGeoData, mapInstance);
      }
    };

    attachFaultMarkers();
  }, [mapInstance.current, faultGeoData]);

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-center h-full px-4">
          <div className="flex flex-col md:flex-row w-full max-w-7xl h-[40rem] bg-white bg-opacity-80 rounded-lg shadow-lg overflow-hidden">
            {/* Key Section */}
            <div className="w-full md:w-1/6 p-6 bg-white bg-opacity-80 flex flex-col justify-center">
              <h2 className="text-xl font-bold mb-4 text-center">Key</h2>
              <div className="flex items-center mb-4">
                <div
                  className="w-6 h-6 rounded-full mr-4"
                  style={{ backgroundColor: "#FF69B4" }} // Pink (Urgent)
                ></div>
                <span className="text-lg">Urgent</span>
              </div>
              <div className="flex items-center mb-4">
                <div
                  className="w-6 h-6 rounded-full mr-4"
                  style={{ backgroundColor: "#FFD700" }} // Yellow (Semi-urgent)
                ></div>
                <span className="text-lg">Semi-urgent</span>
              </div>
              <div className="flex items-center mb-4">
                <div
                  className="w-6 h-6 rounded-full mr-4"
                  style={{ backgroundColor: "#00CED1" }} // Blue (Non-urgent)
                ></div>
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
            <div className="w-full md:w-5/6 flex-grow rounded-lg bg-blue-100">
              <MapboxMap zoom={6} centerOnMuni={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-center h-full px-4">
          <div className="flex flex-col md:flex-row w-full max-w-7xl h-[55vh] bg-white bg-opacity-80 rounded-lg shadow-lg overflow-hidden">
            {/* Map Section */}
            <div className="w-full md:w-5/6 flex-grow rounded-lg bg-blue-100">
              <MapboxMap zoom={6} centerOnMuni={true} />
            </div>

            {/* Key Section */}
            <div className="w-full md:w-1/6 p-2 bg-white flex flex-col justify-center">
              <h2 className="text-lg font-bold text-center">Key</h2>
              <div className="flex items-center mb-1">
                <div
                  className="w-6 h-6 rounded-full mr-4"
                  style={{ backgroundColor: "#FF69B4" }} // Pink (Urgent)
                ></div>
                <span className="text-sm">Urgent</span>
              </div>
              <div className="flex items-center mb-1">
                <div
                  className="w-6 h-6 rounded-full mr-4"
                  style={{ backgroundColor: "#FFD700" }} // Yellow (Semi-urgent)
                ></div>
                <span className="text-sm">Semi-urgent</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full mr-4"
                  style={{ backgroundColor: "#00CED1" }} // Blue (Non-urgent)
                ></div>
                <span className="text-sm">Non-urgent</span>
              </div>
              <div className=" text-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}
