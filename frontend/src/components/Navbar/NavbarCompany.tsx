"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, PlusCircle, Bell, Search, FileText, ChartNoAxesCombined} from 'lucide-react';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useProfile } from '@/hooks/useProfile';
import { UserData } from '@/types/custom.types';
import { usePathname } from 'next/navigation';
import { handleSignOut } from '@/services/auth.service';
import Image from 'next/image';

export default function NavbarCompany({ unreadNotifications = 0 }) {
  const pathname = usePathname(); // Get the current pathname
  const [data, setData] = useState<UserData | null>(null);
  const { getUserProfile } = useProfile();

  const onLogout = async () => {
    await handleSignOut();
    window.location.href = "/";
  };

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
          user_role: userData.current.user_role,
          municipality: userData.current.municipality
        };

        setData(updatedUserData);
      }
    };

    getProfileData();
  }, [getUserProfile]);

  // Function to apply blue highlight effect to the selected item
  const getNavItemClass = (path: string) => {
    return pathname === path
      ? "text-blue-400 cursor-pointer transform hover:scale-105 transition-transform duration-200"
      : "text-white cursor-pointer transform hover:scale-105 transition-transform duration-200";
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <nav className="z-40 fixed top-0 w-full bg-black bg-opacity-50 p-4 flex items-center justify-between">
          <Link href="/">
            <div className="text-white font-bold ms-2 transform hover:scale-105 transition-transform duration-200">
              <img src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-128.webp" alt="MyCity" width={64} height={64} />
            </div>
          </Link>

          <div className="flex-initial text-[0.95rem] flex me-5 space-x-5 items-center">
            <Link href="/dashboard/service-provider" passHref>
              <div className={getNavItemClass("/dashboard/service-provider")}>
                <div className="flex flex-col gap-1 items-center">
                  <Home size={25} />
                  <span>Dashboard</span>
                </div>
              </div>
            </Link>

            
            <Link href="/statistics/service-provider" passHref>
              <div className={getNavItemClass("/statistics/service-provider")}>
                <div className="flex flex-col gap-1 items-center">
                  <ChartNoAxesCombined size={25} />
                  <span>Statistics</span>
                </div>
              </div>
            </Link>

            <Link href="/notifications/service-provider" passHref>
              <div className={getNavItemClass("/notifications/service-provider")}>
                <div className="relative flex flex-col gap-1 items-center">
                  <Bell size={25} />
                  {/* {unreadNotifications > 0 && (
                    <div className="absolute top-0 right-0 h-5 w-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full z-100">
                      {unreadNotifications}
                    </div>
                  )} */}
                  <span>Notifications</span>
                </div>
              </div>
            </Link>

            <Link href="/search/service-provider" passHref>
              <div className={getNavItemClass("/search/service-provider")}>
                <div className="flex flex-col gap-1 items-center">
                  <Search size={25} />
                  <span>Search</span>
                </div>
              </div>
            </Link>

            <Link href="/tenders/service-provider" passHref>
              <div className={getNavItemClass("/tenders/service-provider")}>
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

                <DropdownItem key="logout" onClick={onLogout} role="button" className="h-9 hover:bg-grey-500" textValue="Log out">
                  <span className="text-danger text-sm">Log out</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </nav>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        {/* Bottom Bar */}
        <div className="bottom-0 w-full h-20 bg-black bg-opacity-70 fixed flex items-center justify-center z-50">
          <nav className="z-51 fixed w-full p-0 flex items-center justify-between">
            <div className="flex w-full text-[0.95rem] items-center justify-between px-6">
              <Link href="/dashboard/service-provider" passHref>
                <div className={getNavItemClass("/dashboard/service-provider")}>
                  <div className="flex flex-col gap-1 items-center">
                    <Home size={50} />
                  </div>
                </div>
              </Link>

              <Link href="/notifications/service-provider" passHref>
                <div className={getNavItemClass("/notifications/service-provider")}>
                  <div className="relative flex flex-col gap-1 items-center">
                    <Bell size={50} />
                    {/* {unreadNotifications > 0 && (
                      <div className="absolute top-0 right-0 h-5 w-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full z-100">
                        {unreadNotifications}
                      </div>
                    )} */}
                  </div>
                </div>
              </Link>

              <Link href="/search/service-provider" passHref>
                <div className={getNavItemClass("/search/service-provider")}>
                  <div className="flex flex-col gap-1 items-center">
                    <Search size={50} />
                  </div>
                </div>
              </Link>

              <Link href="/tenders/service-provider" passHref>
                <div className={getNavItemClass("/tenders/service-provider")}>
                  <div className="flex flex-col gap-1 items-center">
                    <FileText size={50} />
                  </div>
                </div>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
