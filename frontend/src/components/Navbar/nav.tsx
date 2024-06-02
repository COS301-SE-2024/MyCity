import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Dynamic import of useRouter to handle SSR
const DynamicRouter = dynamic(() => import('next/router'), {
  ssr: false
});

const Navbar = () => {
  const [isHome, setIsHome] = useState(false);
  const [routerLoaded, setRouterLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsHome(false); //for now manually set to true or false to see different variations of nav depending on state
      setRouterLoaded(true);
    }
  }, []);

  if (!routerLoaded) {
    return (
      <nav className="bg-black bg-opacity-50 p-4 flex items-center justify-between">
        <div className="text-white font-bold">MyCity</div>
        <div className="flex-initial flex mr-0 space-x-4 items-center">
          <div className="text-white">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black bg-opacity-50 p-4 flex items-center justify-between">
      <div className="text-white font-bold">MyCity</div>
      <div className="flex-initial flex mr-0 space-x-4 items-center">
        <Link href="/">
          <div className={`text-white hover:text-gray-300 cursor-pointer ${isHome ? 'underline' : ''}`}>
            Welcome
          </div>
        </Link>
        <Link href="/how-it-works">
          <div className={`text-white hover:text-gray-300 cursor-pointer ${typeof window !== 'undefined' && router.pathname === '/how-it-works' ? 'underline' : ''}`}>
            How it works
          </div>
        </Link>
        <Link href="/about">
          <div className={`text-white hover:text-gray-300 cursor-pointer ${typeof window !== 'undefined' && router.pathname === '/about' ? 'underline' : ''}`}>
            About us
          </div>
        </Link>
        {isHome && (
          <Link href="/signup">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-600 transition duration-300 font-bold">
              Register Now
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
