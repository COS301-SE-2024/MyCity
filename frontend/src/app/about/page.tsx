"use client";

import Navbar from "@/components/Navbar/Navbar";

export default function About() {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <Navbar />
          <main>
            <div className="flex items-center justify-center">
              <span className="text-[4rem]">About MyCity...</span>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div>
          {/* MyCity Logo */}
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
          />

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10">
            {" "}
            {/* Ensure content is above the background */}
            <h1 className="text-4xl text-white font-bold mb-4 ml-4">
              What is
              <span className="text-blue-200"> MyCity</span>?
            </h1>
            <div className="bg-white ml-4 mr-4">
              <p className="text-lg text-gray-200 mb-4 ml-4">
                MyCity is a powerful Progressive Web App designed to enhance the
                way third-party companies, community members, and municipalities
                interact and manage community assets. <br /> <br />
                By offering a unified platform, MyCity allows users to track
                assets, log tickets related to these assets, and receive
                real-time updates on any progress. <br /> <br />
                This innovative solution reduces communication noise and
                streamlines issue reporting, ensuring that all stakeholders are
                kept informed and connected.
              </p>
            </div>
          </div>

          <Navbar />
        </div>
      </div>
    </div>
  );
}
