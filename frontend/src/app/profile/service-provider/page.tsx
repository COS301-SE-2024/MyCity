"use client";

import React, { useEffect } from "react";
import EditCitizenProfile from "@/components/EditProfile/UserProfile";

export default function ServiceProviderProfile() {
  //     const [initialData, setInitialData] = useState({
  //       username: '',
  //       email: '',
  //       name: '',
  //       surname: '',
  //       age: 0,
  //       password: '',
  //       cellphone: '',
  //       municipality: ''
  //     });

  useEffect(() => {
    // Fetch initial data for the citizen user
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/profile/citizen");
        const data = await response.json();
        // setInitialData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

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
          <main className="h-screen flex justify-center p-20">
            <div className="flex flex-col items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit py-12 px-7">
              <span className="text-[2.5em] font-bold">
                {"Update Service Provider Profile."}
              </span>
              {/* <EditCitizenProfile /> */}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden", // Prevents content overflow
          }}
        >
          <div className="text-white font-bold ms-2 transform hover:scale-105 mt-5 ml-5 transition-transform duration-200">
            <img
              src="https://i.imgur.com/WbMLivx.png"
              alt="MyCity"
              width={100}
              height={100}
              className="w-100 h-100"
            />
          </div>

          {/* Background image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10">
            {" "}
            {/* Ensure content is above the background */}
            <h1 className="text-4xl text-white font-bold mb-4 ml-4">
              <span className="text-blue-200">MyCity</span> <br />
              Under Construction
            </h1>
            <div className="text-white font-bold transform hover:scale-105 transition-transform duration-200 flex justify-center">
              <img
                src="https://i.imgur.com/eGeTTuo.png"
                alt="Under-Construction"
                width={300}
                height={300}
              />
            </div>
            <p className="text-lg text-gray-200 mb-4 ml-4">
              Our Mobile site is currently under construction.
              <br />
              Please use our Desktop site while we
              <br />
              work on it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
