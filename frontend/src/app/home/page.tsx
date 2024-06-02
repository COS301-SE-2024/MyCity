'use client'

import Nav from "@/components/Navbar/nav";
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ backgroundImage: 'url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")' }}>
      <Nav />
      <div className="h-[30vh] flex items-center justify-center"></div>
      <div className='container mx-auto p-2'>
        <h1 className="text-4xl font-bold mb-4">
          Be the change in your city <br />
          with MyCity.
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          MyCity connects citizens with municipalities and third-party businesses
          to identify and solve problems in your city - fast.
        </p>
        <Link href="/signup">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
