"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface PWAPromptProps {
  onInstall: () => void;
  onCancel: () => void;
}

export default function PWAPrompt({ onInstall, onCancel }: PWAPromptProps) {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white w-1/3 border rounded-lg p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onCancel}
            >
              <X size={24} />
            </button>
            <div className="flex justify-center">
              <Image
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/camera_icon.webp"
                alt="Install Logo"
                width={400}
              />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-center">
              Install our PWA!
            </h1>
            <p className="text-md mb-4 text-center">
              Install our PWA to receive personalized results and updates based
              on your area, even when you are offline.
            </p>
            <p className="text-sm mb-4 text-center">
              Available on Android, Windows, and iOS.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition duration-300"
                onClick={onInstall}
              >
                Install
              </button>
              <button
                className="bg-blue-100 text-gray-700 px-4 py-2 rounded-3xl hover:bg-blue-200 transition duration-300"
                onClick={onCancel}
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white w-5/6 border rounded-lg p-2 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onCancel}
            >
              <X size={24} />
            </button>
            <div className="flex justify-center">
              <Image
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/location_icon.webp"
                alt="Location Logo"
                width={100}
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
                onClick={onInstall}
              >
                Enable Notifications
              </button>
              <button
                className="bg-blue-100 text-gray-700 px-3 py-3 rounded-3xl hover:bg-blue-200 transition duration-300"
                onClick={onCancel}
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
