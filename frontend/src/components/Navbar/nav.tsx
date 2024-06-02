import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-black bg-opacity-50 p-4 flex items-center justify-between">
      <div className="text-white font-bold">MyCity</div>
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
        <Link href="/signup">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-600 transition duration-300 font-bold">
            Register Now
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
