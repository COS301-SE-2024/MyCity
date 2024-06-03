import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black bg-opacity-50 p-4 flex items-center justify-between">
      <div className="text-white font-bold"><img src="https://i.imgur.com/4RVgkf9.png" alt="MyCity" width={50} height={50} /></div>
      
      <div className="flex-initial flex mr-0 space-x-4 items-center">
        <Link href="/">
          <div className="text-white hover:text-gray-300 cursor-pointer">
            Welcome
          </div>
        </Link>
        <Link href="/how-it-works">
          <div className="text-white hover:text-gray-300 cursor-pointer">
            How it works
          </div>
        </Link>
        <Link href="/about">
          <div className="text-white hover:text-gray-300 cursor-pointer">
            About us
          </div>
        </Link>
        <Link href="/login">
          <div className="bg-gray-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-600 transition duration-300 font-bold">
            Login
          </div>
        </Link>
        <Link href="/signup">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-600 transition duration-300 font-bold">
            Register Now
          </div>
        </Link>
      </div>
    </nav>
  );
}