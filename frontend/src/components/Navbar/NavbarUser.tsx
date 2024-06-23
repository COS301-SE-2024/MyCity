import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, PlusCircle, Bell, Search, Settings, UserCircle } from 'lucide-react';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useProfile } from '@/context/UserProfileContext';
import { UserData } from '@/types/user.types';
import { handleSignOut } from '@/lib/cognitoActions';

export default function NavbarUser() {
  // const [profileImage, setProfileImage] = useState<string | null>(null);
  const [data, setData] = useState<UserData | null>(null);
  const { getUserProfile } = useProfile();


  // useEffect(() => {
  //   const storedProfileImage = localStorage.getItem('profileImage');
  //   if (storedProfileImage) {
  //     setProfileImage(storedProfileImage);
  //   }
  // }, []);


  useEffect(() => {
    const getProfileData = async () => {
      const userData = await getUserProfile();

      if (userData.current) {

        const storedProfileImage = localStorage.getItem('profileImage') ? localStorage.getItem('profileImage')! : undefined;

        const updatedUserData: UserData = {
          sub: userData.current.sub,
          email: userData.current.email,
          given_name: userData.current.given_name,
          family_name: userData.current.family_name,
          picture: userData.current.picture ? userData.current.picture : storedProfileImage,
          user_role: userData.current.user_role
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
          <img src="https://i.imgur.com/WbMLivx.png" alt="MyCity" width={50} height={50} className="w-50 h-50"/>
        </div>
      </Link>

      <div className="flex-initial text-[0.95rem] flex me-5 space-x-5 items-center">
        <Link href="/dashboard/citizen" passHref>
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <Home size={25} />
              <span>Dashboard</span>
            </div>
          </div>
        </Link>

        <Link href="/create-ticket" passHref>
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <PlusCircle size={25} />
              <span>Add Ticket</span>
            </div>
          </div>
        </Link>

        <Link href="/notifications/citizen" passHref>
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <Bell size={25} />
              <span>Notifications</span>
            </div>
          </div>
        </Link>

        <Link href="/search/citizen" passHref>
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <Search size={25} />
              <span>Search</span>
            </div>
          </div>
        </Link>

        {/* <Link href="/settings/citizen" passHref>
          <div className="text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col gap-1 items-center">
              <Settings size={25} />
              <span>Settings</span>
            </div>
          </div>
        </Link> */}

        {/* User profile picture */}
        {/* <Link href="/settings/citizen" passHref>
          <div className="flex items-center gap-1 text-white cursor-pointer transform hover:scale-105 transition-transform duration-200">
            {profileImage ? (
              <Image src={profileImage} alt="User Profile" width={10} height={10} className="h-10 w-10 rounded-full" />
            ) : (
              <UserCircle size={40} />
            )}
          </div>
        </Link> */}


        {/* <Link href="/settings" passHref>
          <div className="cursor-pointer transform hover:scale-102 transition-transform duration-200">
            <Avatar
              showFallback
              src={data?.picture}
              className="w-10 h-10 b-0 ring-offset-1 ring-offset-blue-300 ring-2 ring-blue-500"
            />
          </div>
        </Link> */}

        <Dropdown className="bg-blue-900">
          <DropdownTrigger className="cursor-pointer">
            <Avatar
              showFallback
              src={data?.picture}
              // src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
              className="w-10 h-10 b-0 ring-offset-1 ring-offset-blue-300 ring-2 ring-blue-500"
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Menu Actions" className="px-0 py-2 gap-0 rounded-sm text-white">
            <DropdownItem key="settings" className="h-9 hover:bg-blue-500 focus:bg-blue-500" textValue="Settings">
              <Link href="/settings/citizen" passHref>
                <span className="text-sm">Settings</span>
              </Link>
            </DropdownItem>

            <DropdownItem key="about" className="h-9 hover:bg-blue-500" textValue="About us">
              <Link href="/about" passHref>
                <span className="text-sm">About us</span>
              </Link>
            </DropdownItem>

            <DropdownItem key="logout" className="h-9 hover:bg-blue-500" textValue="Log out">
              <Link href="/" className="text-sm" passHref onClick={handleSignOut}>
                <span className="text-danger text-sm">Log out</span>
              </Link>
            </DropdownItem>


          </DropdownMenu>
        </Dropdown>


      </div >
    </nav >
  );
}
