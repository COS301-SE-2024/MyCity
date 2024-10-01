import dynamic from "next/dynamic";
import React from "react";

const MapboxMap = dynamic(() => import("../MapboxMap/MapboxMap"), {
  ssr: false,
});

interface TenderProps {
  tender_id: string;
  tendernumber: string;
  company_id: string;
  companyname: string;
  datetimesubmitted: string;
  ticket_id: string;
  status: string;
  quote: number;
  description: string;
  estimatedTimeHours: number;
  longitude: string;
  latitude: string;
  municipalityImage: string;
  title: string;
  address: string;
  onBack: () => void;
}

const ViewBid: React.FC<TenderProps> = ({
  tender_id,
  tendernumber,
  company_id,
  companyname,
  datetimesubmitted,
  ticket_id,
  status,
  quote,
  description,
  estimatedTimeHours,
  longitude,
  latitude,
  municipalityImage,
  title,
  address,
  onBack,
}) => {
  // Mocked data for demonstration
  const proposedPrice = quote;
  const jobDuration = "5";
  const fileName = "example_file.pdf";

  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-4 max-w-full lg:max-w-4xl mx-auto flex flex-col lg:flex-row w-full">
  {/* Form Section */}
  <div className="flex-1 p-4 flex flex-col items-center justify-center">
    {/* Municipality Image */}
    <img
      src={municipalityImage}
      alt="Municipality"
      width={64}
      height={64}
      className="w-16 h-16 rounded-full mb-4"
    />
    <h2 className="text-xl font-bold mb-2 text-center">
      Fault #{tendernumber}
    </h2>
    <p className="text-lg font-semibold mb-2 text-center">{title}</p>
    <p className="text-md mb-4 text-center">{description}</p>
    <div className="mb-4 text-center">
      <p className="text-lg font-semibold">Fault Address</p>
      <p>{address}</p>
    </div>
    {/* Proposed Price Input */}
    <div className="mb-4 w-full">
      <label className="block text-lg font-semibold mb-1">
        Proposed Price
      </label>
      <div className="relative">
        <span className="absolute left-0 top-0 bottom-0 flex items-center pl-2">
          R
        </span>
        <input
          type="text"
          value={proposedPrice}
          readOnly
          className="w-full pl-6 pr-2 py-1 border rounded bg-gray-100"
        />
      </div>
    </div>
    {/* Job Duration Input */}
    <div className="mb-4 w-full">
      <label className="block text-lg font-semibold mb-1">
        Job Duration
      </label>
      <div className="relative">
        <input
          type="text"
          value={jobDuration}
          readOnly
          className="w-full pl-2 pr-10 py-1 border rounded bg-gray-100"
        />
        <span className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
          days
        </span>
      </div>
    </div>
    {/* File Upload Section */}
    <div className="mb-4 w-full">
      <p className="text-lg font-semibold mb-1">
        Other Relevant Information
      </p>
      <div className="border-dashed border-2 border-gray-400 rounded-lg p-4 w-full">
        <a href="#" className="text-blue-500 underline">
          {fileName}
        </a>
      </div>
    </div>
    {/* Back Button */}
    <div className="mt-4 flex justify-center gap-8">
      <button
        type="button"
        className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  </div>

  {/* Map Section - Only show on lg screens and larger */}
  <div className="hidden lg:flex w-full lg:w-2/3 bg-gray-200 items-center justify-center p-4 lg:p-0">
    <div className="w-full h-[500px] lg:h-full text-gray-500" id="map">
      <MapboxMap
        centerLng={Number(longitude)}
        centerLat={Number(latitude)}
        dropMarker={true}
        addNavigationControl={true}
        zoom={14}
      />
    </div>
  </div>
</div>

  );
};

export default ViewBid;
