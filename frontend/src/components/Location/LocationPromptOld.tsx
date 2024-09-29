"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import ToggleTheme from '@/components/Theme/ToggleTheme';


export default function Promt_Popup() {
  const [userResponded, setUserResponded] = useState(false);
  const closePopup = () => setUserResponded(true);

  console.log("User Responded: ", userResponded);
  return !userResponded ? (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
        // onClick={closePopup}
        >
          <div
            className="dark:bg-gray-700 dark:text-white bg-gray-100 w-1/3 rounded-lg p-4 relative"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the popup
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closePopup}
            >
              <X size={24} />
            </button>
            <div className="flex justify-center">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/location_icon.webp"
                alt="Location Logo"
                width={100}
                height={100}
                className="p-2"
              />
            </div>
            <h1 className="text-2xl font-bold my-4 text-center">
              Enable Location Services!
            </h1>
            <p className="text-md mb-4 text-center">
              Enable location to receive personalized results and updates based
              on your area.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition duration-300"
                // onClick={handleEnableLocation}
                onClick={closePopup}
              >
                Enable Location
              </button>
              <button
                className="bg-blue-100 text-gray-700 px-4 py-2 rounded-3xl hover:bg-blue-200 transition duration-300"
                onClick={closePopup}
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
        // onClick={closePopup}
        >
          <div
            className="bg-white w-5/6 border rounded-lg p-2 relative"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the popup
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closePopup}
            >
              <X size={24} />
            </button>
            <div className="flex justify-center">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/location_icon.webp"
                alt="Location Logo"
                width={100}
                height={100}
                className="p-2"
              />
            </div>
            <h1 className="text-2xl font-bold my-2 text-center">
              Stay Connected!
            </h1>
            <p className="text-sm mb-4 text-center">
              Enable notifications to stay updated with the latest information
              and updates.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-500 text-white px-3 py-3 rounded-3xl hover:bg-blue-600 transition duration-300"
                // onClick={handleEnableNotifications}
                onClick={closePopup}
              >
                Enable Notifications
              </button>
              <button
                className="bg-blue-100 text-gray-700 px-3 py-3 rounded-3xl hover:bg-blue-200 transition duration-300"
                onClick={closePopup}
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
