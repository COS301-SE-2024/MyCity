"use client";

import React from "react";
import { X } from "lucide-react";

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
            className="dark:bg-gray-700 dark:text-white bg-white w-1/3 rounded-lg p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onCancel}
            >
              <X size={24} />
            </button>
            <div className="flex justify-center">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/installl_pwa.webp"
                alt="Install Logo"
                width={200}
                height={200}
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
      className="dark:bg-gray-700 dark:text-white bg-white w-[90%] max-w-md rounded-lg p-4 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onCancel}
      >
        <X size={24} />
      </button>
      <div className="flex justify-center">
        <img
          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/installl_pwa.webp"
          alt="Install Logo"
          className="w-40 h-40" // Ensures consistent size for the logo
        />
      </div>
      <h1 className="text-xl font-bold mb-3 text-center">
        Install our PWA!
      </h1>
      <p className="text-sm mb-3 text-center">
        Install our PWA to receive personalized results and updates based
        on your area, even when you are offline.
      </p>
      <p className="text-xs mb-3 text-center">
        Available on Android, Windows, and iOS.
      </p>
      <div className="flex justify-center space-x-2">
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition duration-300"
          onClick={onInstall}
        >
          Install
        </button>
        <button
          className="bg-blue-100 text-gray-700 px-3 py-2 rounded-full hover:bg-blue-200 transition duration-300"
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
