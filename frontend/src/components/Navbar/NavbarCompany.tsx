import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, PlusCircle, Bell, Search, FileText } from 'lucide-react';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useProfile } from '@/hooks/useProfile';
import { UserData } from '@/types/custom.types';
import { useRouter } from 'next/navigation';
import { handleSignOut } from '@/services/auth.service';

export default function NavbarCompany() {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const { getUserProfile } = useProfile();

  const onLogout = async () => {
    await handleSignOut();
    router.push("/");
  };

  useEffect(() => {
    const getProfileData = async () => {
      const userData = await getUserProfile(); //this logic might change because this is the municipality user

      if (userData.current) {
        const storedProfileImage = localStorage.getItem('profileImage') ? localStorage.getItem('profileImage')! : undefined;

        const updatedUserData: UserData = {
          sub: userData.current.sub,
          email: userData.current.email,
          given_name: userData.current.given_name,
          family_name: userData.current.family_name,
          picture: userData.current.picture ? userData.current.picture : storedProfileImage,
          user_role: userData.current.user_role,
          municipality: userData.current.municipality
        };

        setData(updatedUserData);
      }
    };

    getProfileData();

  }, [getUserProfile]);

  return (
    <nav className="z-40 fixed top-0 w-full bg-black bg-opacity-50 p-4 flex items-center justify-between">
      <Link href="/">
        <div className="text-white font-bold ms-2 transform hover:scale-105 transition-transform duration-200">
          <img src="https://i.imgur.com/WbMLivx.png" alt="MyCity" width={50} height={50} className="w-50 h-50" />
        </div>
      </Link>

      <div className="flex-initial text-[0.95rem] flex me-5 space-x-5 items-center">
        <Link href="/dashboard/service-provider" passHref>
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <Home size={25} />
              <span>Dashboard</span>
            </div>
          </div>
        </Link>

        <Link href="/create-ticket/service-provider" passHref> {/*same for each user type I believe*/}
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <PlusCircle size={25} />
              <span>Add Ticket</span>
            </div>
          </div>
        </Link>

        <Link href="/notifications/service-provider" passHref> 
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <Bell size={25} />
              <span>Notifications</span>
            </div>
          </div>
        </Link>

        <Link href="/search/service-provider" passHref> 
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <Search size={25} />
              <span>Search</span>
            </div>
          </div>
        </Link>

        <Link href="/tenders/company" passHref>
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <FileText size={25} />
              <span>Tenders</span>
            </div>
          </div>
        </Link>

        <Dropdown className="bg-white">
          <DropdownTrigger className="cursor-pointer" data-testid="profile-dropdown-trigger">
            <Avatar
              showFallback
              src={data?.picture}
              className="w-10 h-10 b-0 ring-offset-1 ring-offset-black-300 ring-2 ring-black-500"
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="profile dropdown" className="px-0 py-2 gap-0 rounded-sm text-black">
            <DropdownItem key="settings" href="/settings/service-provider" role="link" className="h-9 hover:bg-grey-500" textValue="Settings">
              <span className="text-sm">Settings</span>
            </DropdownItem>

            <DropdownItem key="about" href="/about" role="link" className="h-9 hover:bg-grey-500" textValue="About us">
              <span className="text-sm">About us</span>
            </DropdownItem>

            <DropdownItem key="logout" onClick={onLogout} role="button" className="h-9 hover:bg-grey-500" textValue="Log out">
              <span className="text-danger text-sm">Log out</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
}