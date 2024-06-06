import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
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

        <Link href="auth/login">
          <span className="bg-gray-500 flex items-center text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-600 transition duration-300 font-bold">
            Login <ArrowRight className="ms-2" size={18} />
          </span>
        </Link>






        <Dropdown>
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
        </Dropdown>



      </div>
    </nav>
  );
}