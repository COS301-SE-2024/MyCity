"use client";

import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden", // Prevents content overflow
          }}
        >
          <Navbar />
          {/* <NavbarUser /> */}

          {/* Background image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>
          {/* Content */}

          <div className="h-[30vh] flex items-center justify-center"></div>
          <div className="container mx-auto p-2 relative z-10 ml-16">
            {" "}
            {/* Ensure content is above the background */}
            <h1 className="text-4xl text-white font-bold mb-4">
              Be the change in your city <br />
              with <span className="text-blue-200">MyCity.</span>
            </h1>
            <p className="text-lg text-gray-200 mb-4">
              MyCity connects citizens with municipalities and third-party
              businesses <br></br>
              to identify and solve problems in your city - fast.
            </p>
            <div className="flex flex-row gap-12">
              <Link href="/auth/signup">
                <Button className="bg-white text-blue-600 border-2 px-4 py-2 font-bold rounded-3xl">
                  Sign Up
                </Button>
              </Link>

              <Link href="/auth/login" data-testid="login-btn">
                <Button className="bg-blue-500 text-white px-4 py-2 font-bold rounded-3xl">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
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
          <div className="text-white font-bold ms-2 transform hover:scale-105 mt-5 ml-5 transition-transform duration-200 flex justify-center">
            <Image
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-256.webp"
              alt="MyCity"
              width={256}
              height={256}
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
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10 p-6">
            <h1 className="text-4xl text-white font-bold mb-4">
              Be the change in your city <br />
              with <span className="text-blue-200">MyCity.</span>
            </h1>
            <p className="text-xl text-gray-200 mb-4">
              MyCity connects citizens with municipalities and third-party
              businesses to identify and solve problems in your city - fast.
            </p>
            <div className="flex pt-20 justify-center gap-10">
              <Link href="/auth/signup">
                <Button className="bg-white text-blue-600  px-10 py-8 font-bold text-lg rounded-3xl">
                  Sign Up
                </Button>
              </Link>

              <Link href="/auth/login" data-testid="login-btn">
                <Button className="bg-blue-500 text-white px-10 py-8 text-lg font-bold rounded-3xl">
                  Log In
                </Button>
              </Link>
            </div>

            
          </div>
          <Navbar />
        </div>
      </div>
    </>
  );
}
