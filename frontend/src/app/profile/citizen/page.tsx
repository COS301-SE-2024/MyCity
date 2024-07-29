"use client";

import React, { useEffect, useState } from "react";
import EditCitizenProfile from "@/components/EditProfile/UserProfile";
import Navbar from "@/components/Navbar/Navbar";
import { UserData } from "@/types/custom.types";
import { useProfile } from "@/hooks/useProfile";

export default function CitizenProfile() {
  const { getUserProfile } = useProfile();
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    const getProfileData = async () => {
      const profile = await getUserProfile();

      if (profile.current) {
        setData(profile.current);
      }
    };

    getProfileData();
  }, [getUserProfile]);

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch("/api/profile/citizen", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert("Error updating profile: " + errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <Navbar />
          <main className="h-screen flex justify-center p-20">
            <div className="flex flex-col items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit py-12">
              <span className="text-[2.5em] font-bold">
                {"Update User Profile."}
              </span>
              <EditCitizenProfile data={data} />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden"></div>
    </div>
  );
}
