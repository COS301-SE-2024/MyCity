"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, PlusCircle, Bell, Search } from "lucide-react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useProfile } from "@/hooks/useProfile";
import { UserData } from "@/types/custom.types";
import { usePathname } from "next/navigation";
import { handleSignOut } from "@/services/auth.service"; // Import handleSignOut


export default function NavbarMobile({ unreadNotifications = 0 }) {
  const pathname = usePathname(); // Get the current pathname
  const [data, setData] = useState<UserData | null>(null);
  const { getUserProfile } = useProfile();

  const onLogout = async () => {
    await handleSignOut();
    window.location.href = "/"; // Redirect to home page after logout
  };

  useEffect(() => {
    const getProfileData = async () => {
      const userData = await getUserProfile();

      if (userData.current) {
        const storedProfileImage = localStorage.getItem("profileImage")
          ? localStorage.getItem("profileImage")!
          : undefined;

        const updatedUserData: UserData = {
          sub: userData.current.sub,
          email: userData.current.email,
          given_name: userData.current.given_name,
          family_name: userData.current.family_name,
          picture: userData.current.picture
            ? userData.current.picture
            : storedProfileImage,
          user_role: userData.current.user_role,
          municipality: userData.current.municipality,
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

      </div>
      {/* Mobile View */}

      <div className="block sm:hidden">
        {/* Top Bar */}
        <div className="top-0 w-full h-20 fixed flex items-center justify-center">
          <nav className="z-51 fixed w-full p-0 flex items-center justify-center">
            <div className="flex w-full text-[0.95rem]">
              <div className="flex items-center m-4">
                <div className="w-[4rem] h-[4rem]  transform hover:scale-105 transition-transform duration-200">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-128.webp"
                    width={128}
                    height={128}
                    alt="MyCity"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>

              <div className="flex items-center m-4 pr-1 justify-end flex-grow">
                <Dropdown className="bg-white">
                  <DropdownTrigger
                    className="cursor-pointer"
                    data-testid="profile-dropdown-trigger"
                  >
                    <Avatar
                      showFallback
                      src={data?.picture} // Add fallback if necessary
                      className="w-[3.5rem] h-[3.5rem] border-0 "
                    />
                  </DropdownTrigger>

                  <DropdownMenu
                    aria-label="profile dropdown"
                    className="px-0 py-2 gap-0 rounded-sm text-black"
                  >
                    <DropdownItem
                      key="settings"
                      href="/settings/citizen"
                      role="link"
                      className="h-9 hover:bg-gray-500"
                      textValue="Settings"
                    >
                      <span className="text-sm">Settings</span>
                    </DropdownItem>

                    <DropdownItem
                      key="logout"
                      onClick={onLogout}
                      role="button"
                      className="h-9 hover:bg-gray-500"
                      textValue="Log out"
                    >
                      <span className="text-danger text-sm">Log out</span>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
