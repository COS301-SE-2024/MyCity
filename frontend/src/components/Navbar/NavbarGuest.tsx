import Link from "next/link";
import { Building2, Lightbulb, Wrench, Globe } from "lucide-react";

export default function NavbarGuest() {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <nav className="z-40 fixed w-full bg-black bg-opacity-50 p-4 flex items-center justify-between">
          <Link href="/">
            <div className="text-white font-bold ms-2 transform hover:scale-105 transition-transform duration-200">
              <img
                src="https://i.imgur.com/WbMLivx.png"
                alt="MyCity"
                width={50}
                height={50}
                className="w-50 h-50"
              />
            </div>
          </Link>

          <div className="flex-initial text-[0.95rem] flex me-5 space-x-5 items-center">
            <Link href="/" passHref>
              <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
                <div className="flex flex-col gap-1 items-center">
                  <Building2 size={25} />
                  <span>Welcome</span>
                </div>
              </div>
            </Link>

            <Link href="/about" passHref>
              <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
                <div className="flex flex-col gap-1 items-center">
                  <Lightbulb size={25} />
                  <span>What is MyCity</span>
                </div>
              </div>
            </Link>

            <Link href="/" passHref>
              <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
                <div className="flex flex-col gap-1 items-center">
                  <Wrench size={25} />
                  <span>How it works</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/guest" passHref>
              <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
                <div className="flex flex-col gap-1 items-center">
                  <Globe size={25} />
                  <span>Live Activity</span>
                </div>
              </div>
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden bottom-0 w-full h-20 bg-black bg-opacity-70 fixed flex items-center justify-between">
          <nav className="fixed w-full p-4 flex items-center justify-between">
            <div className="flex-initial text-[0.95rem] flex  items-center justify-between w-full">
              <Link href="/" passHref>
              <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
                  <div className="flex flex-col gap-1 items-center">
                    <Building2 size={50} />
                  </div>
               </div>
              </Link>

              <Link href="/about" passHref>
                <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
                  <div className="flex flex-col gap-1 items-center">
                    <Lightbulb size={50} />
                  </div>
                </div>
              </Link>

              <Link href="/" passHref>
                <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
                  <div className="flex flex-col gap-1 items-center">
                    <Wrench size={50} />
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/guest" passHref>
                <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
                  <div className="flex flex-col gap-1 items-center">
                    <Globe size={50} />
                  </div>
                </div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

  );
}
