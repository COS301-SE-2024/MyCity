// components/Navbar.jsx

import Link from 'next/link';

const Navbar = () => {
  return (
    <div>
    <nav className="bg-black bg-opacity-50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold">MyCity</div>
        <div className="flex space-x-4">
        <Link href="#">
            <div className="text-white hover:text-gray-300 cursor-pointer underline">Welcome</div>
          </Link>
          <Link href="/">
            <div className="text-white hover:text-gray-300 cursor-pointer">How it works</div>
          </Link>
          <Link href="/">
            <div className="text-white hover:text-gray-300 cursor-pointer">About us</div>
          </Link>
        </div>
        <Link href="#">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-600 transition duration-300">
            Register Now
          </div>
        </Link>
      </div>
    </nav>
    <div className="h-64 flex items-center justify-center"></div>
    <div className='container mx-auto p-2'>
      <h1 className="text-4xl font-bold mb-4">Be the change in your city <br></br>
      with MyCity.</h1>
      <p className="text-lg text-gray-700 mb-4">MyCity connects citizens with municipalities and third-party businesses
to identify and solve problems in your city - fast. </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition duration-300">
        Get Started
      </button>
    </div>
    </div>
  );
};

export default Navbar;
