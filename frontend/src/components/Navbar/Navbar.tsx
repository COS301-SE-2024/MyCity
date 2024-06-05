import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-50 p-4 flex items-center justify-between">
      <div className="text-white font-bold"><img src="https://i.imgur.com/4RVgkf9.png" alt="MyCity" width={50} height={50} /></div>

      <div className="flex-initial text-[1.1rem] flex mr-0 space-x-4 items-center">
        <Link href="#">
          <span className="text-white underline underline-offset-[0.27rem] hover:text-gray-300 cursor-pointer">
            Welcome
          </span>
        </Link>

        <Link href="#">
          <span className="text-white hover:text-gray-300 cursor-pointer">
            How it works
          </span>
        </Link>

        <Link href="#">
          <span className="text-white hover:text-gray-300 cursor-pointer">
            About us
          </span>
        </Link>

        <Link href="/login">
          <span className="bg-gray-500 flex items-center text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-600 transition duration-300 font-bold">
            Login <ArrowRight className="ms-2" size={18} />
          </span>
        </Link>
        {/* 
        <Link href="/editprofile">
          <span className="text-white hover:text-gray-300 cursor-pointer">
            Edit Profile
          </span>
        </Link>

        <Link href="/report-fault">
          <span className="text-white hover:text-gray-300 cursor-pointer">
            Report a Fault
          </span>
        </Link>
        <Link href="/login">
          <span className="bg-gray-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-600 transition duration-300 font-bold">
            Login
          </span>
        </Link> */}
      </div>
    </nav>
  );
}