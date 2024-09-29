"use client";

import React, { use, useEffect, useState } from "react";
import { X } from "lucide-react";
import ToggleTheme from '@/components/Theme/ToggleTheme';
import { getLocationPermissionStatus, getUserLocation } from "@/utils/permissions.utils";

export default function LocationPermissionModal() {
    const [showLocationPermissionModal, setShowLocationPermissionModal] = useState(false);
    const [message, setMessage] = useState("Enable location to receive personalized results and updates based on your area.\nClick on the \"Allow\" button at the top left of your screen.");

    useEffect(() => {
        const requestLocationPermission = async () => {
            const location = await getUserLocation();
            if (location) {
                setMessage("Location enabled successfully!");
                setTimeout(() => {
                    setShowLocationPermissionModal(false);
                }, 1500);
            }
            else {
                setMessage("Location permission denied. We will not ask again.");
                setTimeout(() => {
                    setShowLocationPermissionModal(false);
                }, 1500);
            }
        };

        const checkLocationPermission = async () => {
            const locationPermissionStatus = await getLocationPermissionStatus();
            if (locationPermissionStatus === "granted" || locationPermissionStatus === "denied") {
                return;
            }
            else if (locationPermissionStatus === "prompt") {
                requestLocationPermission();
                setShowLocationPermissionModal(true);
            }
        };

        checkLocationPermission();
    }, []);

    return (
        <>
            {showLocationPermissionModal ? (
                <div className="flex justify-center z-50 pt-8">
                    {/* Desktop View */}
                    <div className="hidden sm:block">
                        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" onClick={() => setShowLocationPermissionModal(false)}>
                            <div className="dark:bg-gray-700 dark:text-white bg-gray-100 w-1/3 rounded-lg p-4 relative" onClick={(event) => event.stopPropagation()}>
                                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowLocationPermissionModal(false)}>
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
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="block sm:hidden">
                        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" onClick={() => setShowLocationPermissionModal(false)}>
                            <div className="bg-white w-5/6 border rounded-lg p-2 relative" onClick={(event) => event.stopPropagation()}>
                                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowLocationPermissionModal(false)}>
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
                                    Enable Location Services!
                                </h1>
                                <p className="text-sm mb-4 text-center">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : undefined}
        </>);
}
