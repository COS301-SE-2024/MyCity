'use client'


import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@nextui-org/react";
import Link from 'next/link';

export default function Home() {
  return (<div style={{
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',  // Prevents content overflow
  }}>
    <Navbar />
    {/* <NavbarUser /> */}
    {/* Background image */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      zIndex: -1,  // Ensures the background is behind other content
    }}></div>
    {/* Content */}
   
    <div className="h-[30vh] flex items-center justify-center" ></div>
    <div className='container mx-auto p-2 relative z-10 ml-16'> {/* Ensure content is above the background */}
      <h1 className="text-4xl text-white font-bold mb-4">
        Be the change in your city <br />
        with <span className="text-blue-200">MyCity.</span>
      </h1>
      <p className="text-lg text-gray-200 mb-4">
        MyCity connects citizens with municipalities and third-party businesses <br></br>
        to identify and solve problems in your city - fast.
      </p>

      <div className="flex flex-row gap-12">
        <Link href="/auth/signup">
          <Button className="bg-blue-500 text-white px-4 py-2 font-bold rounded-3xl hover:bg-blue-600 transition duration-300">
            Get Started
          </Button>
        </Link>

        <Link href="auth/login" data-testid="login-btn">
          <Button className="bg-blue-500 text-white w-24 px-4 py-2 font-bold rounded-3xl hover:bg-blue-600 transition duration-300">
            Log In
          </Button>
        </Link>
      </div>
    </div>
  </div>
  );
}
