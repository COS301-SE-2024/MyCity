import React from 'react';

const mapPlaceholder = "https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg"; 
const FaultMapView = () => {
    return (
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-2/3 md:pr-4 flex-grow flex pl-2">
            {/* Placeholder for the map */}
            <div className="relative w-full rounded-lg shadow-md overflow-hidden">
              <img src={mapPlaceholder} alt="Map Placeholder" className="absolute top-0 left-0 w-full h-full object-cover rounded-lg" />
              <div className="pt-[56.25%]"></div> {/* 16:9 Aspect Ratio */}
            </div>
          </div>
          <div className="md:w-1/3 flex flex-col">
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex-grow">
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
            <div className="bg-white p-4 rounded-lg shadow-md flex-grow">
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
export default FaultMapView;