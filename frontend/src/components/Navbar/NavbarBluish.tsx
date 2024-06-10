import { cn } from '@/lib/utils';
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { ArrowRight, Building2, Lightbulb, Wrench, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavbarBluish() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-50 p-4 flex items-center justify-between">
      <Link href="/">
        <div className="text-white font-bold ms-2">
          <Image src="https://i.imgur.com/WbMLivx.png" alt="MyCity" width={50} height={50} />
        </div>
      </Link>

      <div className="flex-initial text-[0.95rem] flex me-5 space-x-5 items-center">

        <Link href="/" className={isActive("/") ? "text-blue-500 font-semibold" : "text-gray-300 hover:text-gray-400"}>
          <div className="flex flex-col gap-1 items-center">
            <Building2 size={25} />
            <span>Welcome</span>
          </div>
        </Link>

        <Link href="/about" className={isActive("/about") ? "text-bluesemi-500" : "text-gray-300 hover:text-gray-400"}>
          <div className="flex flex-col gap-1 items-center">
            <Lightbulb size={25} />
            <span>What is MyCity</span>
          </div>
        </Link>

        <Link href="/how-it-works" className={isActive("/how-it-works") ? "text-bluesemi-500" : "text-gray-300 hover:text-gray-400"}>
          <div className="flex flex-col gap-1 items-center">
            <Wrench size={25} />
            <span>How it works</span>
          </div>
        </Link>

        <Link href="/dashboard/guest" className={isActive("/dashboard/guest") ? "text-bluesemi-500" : "text-gray-300 hover:text-gray-400"}>
          <div className="flex flex-col gap-1 items-center">
            <Globe size={25} />
            <span>Live Activity</span>
          </div>
        </Link>


        {/* <Link href="auth/login">
          <div className="flex flex-col items-center gap-1">
            <div className="flex flex-row items-center gap-1 rounded-3xl bg-blue-500 text-white px-4 py-2 w-fit">
              <span>Log In</span>
              <ArrowRight size={18} />
            </div>
            <span className="text-white text-small">Already have an Account?</span>
          </div>
        </Link> */}






        {/* <Dropdown>
          <DropdownTrigger className="cursor-pointer">
            <Avatar showFallback isBordered className="w-[3.2rem] h-[3.2rem]" src="https://i.pravatar.cc/150?u=a04258114e29026302d" />

          </DropdownTrigger>

          <DropdownMenu aria-label="Menu Actions" className="px-0 py-5 gap-0 rounded-none">
            <DropdownItem key="new" className="h-10">
              <span className="text-medium">Account</span>
            </DropdownItem>
            <DropdownItem key="copy" className="h-10">
              <span className="text-medium">Dashboard</span>
            </DropdownItem>
            <DropdownItem key="edit" className="h-10">
              <span className="text-medium">Help</span>
            </DropdownItem>
            <DropdownItem key="delete" className="h-10">
              <span className="text-danger text-medium">Logout</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> */}



      </div>
    </nav >
  );
}