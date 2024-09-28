import React, { useState } from 'react';
import { FaMapMarkedAlt, FaInfoCircle } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useProfile } from "@/hooks/useProfile";
import { CreatTender } from '@/services/tender.service';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const MapboxMap = dynamic(() => import("../MapboxMap/MapboxMap"), {
  ssr: false,
});

interface CreateBidProps {
  ticket_id: string;
  longitude: string;
  latitude: string;
  company_name: string;
  ticketnumber: string;
  faultType: string;
  description: string;
  address: string;
  municipalityImage: string;
  onBack: () => void;
}

const CreateBid: React.FC<CreateBidProps> = ({
  ticket_id, longitude, latitude, company_name, ticketnumber, faultType,
  description, address, municipalityImage, onBack
}) => {
  const userProfile = useProfile();
  const [proposedPrice, setProposedPrice] = useState('0.00');
  const [jobDuration, setJobDuration] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    const price = Number(proposedPrice);
    const duration = Number(jobDuration);
    const user_data = await userProfile.getUserProfile();
    const user_session = String(user_data.current?.session_token);
    const response_submit = await CreatTender(company_name, price, ticket_id, duration, user_session);
    setLoading(false); // Stop loading
    if (response_submit === true) {
      onBack(); // Go back to the previous state on success
    } else {
      // Handle error with a toast notification or any other method
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowDialog(true);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    if (!isNaN(Number(value))) {
      value = parseFloat(value).toFixed(2);
      setProposedPrice(value);
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setJobDuration(value);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto flex flex-col lg:flex-row w-full">
        {/* Form Section */}
        {!showMap && (
          <div className="flex-1 p-4">
            {/* Map Toggle Button */}
            <div className="flex justify-end mb-4">
              <FaMapMarkedAlt
                className="text-2xl cursor-pointer text-gray-500 hover:text-gray-700 transition-transform transform hover:scale-110"
                onClick={() => setShowMap(true)}
              />
            </div>
            {/* Municipality Image */}
            <Image src={municipalityImage} alt="Municipality" className="w-16 h-16 rounded-full mb-4 mx-auto" />
            <h2 className="text-xl font-bold mb-2 text-center">Fault #{ticketnumber}</h2>
            <p className="text-lg font-semibold mb-2 text-center">{faultType}</p>
            <p className="text-md mb-4 text-center">{description}</p>
            <div className="mb-4 text-center">
              <p className="text-lg font-semibold">Fault Address</p>
              <p>{address}</p>
            </div>
            {/* Form */}
            <form onSubmit={handleFormSubmit}>
              {/* Proposed Price Input */}
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-1" htmlFor="proposedPrice">Proposed Price</label>
                <div className="relative">
                  <span className="absolute left-0 top-0 bottom-0 flex items-center pl-2">R</span>
                  <input
                    type="text"
                    id="proposedPrice"
                    value={proposedPrice}
                    onChange={handlePriceChange}
                    className="w-full pl-6 pr-2 py-1 border rounded-3xl"
                    placeholder="0.00"
                  />
                </div>
              </div>
              {/* Job Duration Input */}
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-1" htmlFor="jobDuration">Job Duration</label>
                <div className="relative">
                  <input
                    type="text"
                    id="jobDuration"
                    value={jobDuration}
                    onChange={handleDurationChange}
                    className="w-full pl-2 pr-10 py-1 border rounded-3xl"
                    placeholder="Days"
                  />
                  <span className="absolute right-0 top-0 bottom-0 flex items-center pr-2">days</span>
                </div>
              </div>
              {/* File Upload */}
              <div className="mb-4">
                <p className="text-lg font-semibold mb-1">Other Relevant Information</p>
                <div className="border-dashed border-2 border-gray-400 rounded-3xl p-4">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
              {/* Submit and Back Buttons */}
              <div className="mt-4 flex justify-center gap-8">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300"
                  onClick={onBack}
                >
                  Back
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Map Section */}
        {showMap && (
          <div className="w-full bg-gray-200 flex items-center justify-center p-4 relative">
            <div className="absolute top-4 left-4 z-10">
              <FaMapMarkedAlt
                className="text-2xl cursor-pointer text-gray-500 hover:text-gray-700 transition-transform transform hover:scale-110"
                onClick={() => setShowMap(false)}
              />
            </div>
            <div className="w-full h-96 text-gray-500" id="map">
              <MapboxMap centerLng={Number(longitude)} centerLat={Number(latitude)} dropMarker={true} addNavigationControl={true} zoom={14} />
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg mx-auto">
            <div className="flex justify-center mb-4">
              <FaInfoCircle size={48} className="text-blue-500" />
            </div>
            <p className="text-gray-700 text-center mb-8">
              Please note that jobs are issued independently by municipalities based on metrics of their own discretion.
              They are in no way required to disclose their selection processes with 3rd-party companies bidding for jobs.
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <ThreeDots height="40" width="80" radius="9" color="#ADD8E6" ariaLabel="three-dots-loading" visible={true} />
        </div>
      )}
    </>
  );
};

export default CreateBid;
