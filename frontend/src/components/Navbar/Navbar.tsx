import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-50 p-4 flex items-center justify-between">
      <div className="text-white font-bold"><img src="https://i.imgur.com/4RVgkf9.png" alt="MyCity" width={50} height={50} /></div>
      
      <div className="flex-initial flex mr-0 space-x-4 items-center">
        <Link href="/">
          <div className="text-white hover:text-gray-300 cursor-pointer">
            Welcome
          </div>
        </Link>
        <Link href="/editprofile">
          <div className="text-white hover:text-gray-300 cursor-pointer">
            Edit Profile
          </div>
        </Link>
        <Link href="/report-fault">
          <div className="text-white hover:text-gray-300 cursor-pointer">
            Report a Fault
          </div>
        </Link>
        <Link href="/login">
          <div className="bg-gray-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-600 transition duration-300 font-bold">
            Login
          </div>
        </Link>
      </div>
    </nav>
  );
}