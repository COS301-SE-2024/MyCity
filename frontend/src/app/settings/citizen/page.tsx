"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarUser from "@/components/Navbar/NavbarUser";
import ChangeAccountInfo from "@/components/Settings/citizen/ChangeAccountInfo";
import ChangePassword from "@/components/Settings/citizen/ChangePassword";
import { useProfile } from "@/context/UserProfileContext";
import Image from "next/image";
import { User } from "lucide-react";
import { UserData } from "@/types/user.types";

type SubPage = "ChangeAccountInfo" | "ChangePassword" | null;


export default function Settings() {
  const { getUserProfile } = useProfile();
  const [data, setData] = useState<UserData | null>(null);

  const [activeTab, setActiveTab] = useState("AccountInformation");
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [locationAccess, setLocationAccess] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [largerFont, setLargerFont] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>(""); //change these to the demo user's name

  const router = useRouter();


  useEffect(() => {
    const getProfileData = async () => {
      const profile = await getUserProfile();

      if (profile.current) {
        setData(profile.current);
      }
    };

    const storedProfileImage = localStorage.getItem("profileImage");
    const storedFirstName = localStorage.getItem("firstName");
    const storedSurname = localStorage.getItem("surname");

    if (storedProfileImage) setProfileImage(storedProfileImage);
    if (storedFirstName) setFirstName(storedFirstName);
    if (storedSurname) setSurname(storedSurname);

    // getProfileData();
  }, [getUserProfile]);

  const toggleDarkMode = () => {
    setDarkMode((prevState) => !prevState);
  };

  const toggleLargerFont = () => {
    setLargerFont((prevState) => !prevState);
  };

  const toggleLocationAccess = () => {
    setLocationAccess((prevState) => !prevState);
  };

  const toggleTwoFactorAuth = () => {
    setTwoFactorAuth((prevState) => !prevState);
  };

  const toggleEmailNotifications = () => {
    setEmailNotifications((prevState) => !prevState);
  };

  const toggleMuteNotifications = () => {
    setMuteNotifications((prevState) => !prevState);
  };

  const handleDeleteAccount = () => {
    // Clear local storage
    localStorage.clear();
    // Redirect to home page
    router.push("/");
  };

  const openConfirmation = () => {
    setShowConfirmation(true);
  };

  const renderSubPageContent = () => {
    switch (subPage) {
      case "ChangeAccountInfo":
        return <ChangeAccountInfo onBack={() => setSubPage(null)} />;
      case "ChangePassword":
        return <ChangePassword onBack={() => setSubPage(null)} />;
      default:
        return (
          <div className="space-y-4">
            <button
              className="w-full text-left hover:bg-gray-100 p-2 rounded"
              onClick={() => setSubPage("ChangeAccountInfo")}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span className="text-lg font-semibold">
                  Change Account Information
                </span>
              </div>
              <p className="text-gray-600">
                See and change your account&apos;s information.
              </p>
            </button>
            <button
              className="w-full text-left hover:bg-gray-100 p-2 rounded"
              onClick={() => setSubPage("ChangePassword")}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span className="text-lg font-semibold">Change Password</span>
              </div>
              <p className="text-gray-600">Change your password at any time.</p>
            </button>
            <button
              className="w-full text-left hover:bg-gray-100 p-2 rounded text-red-600"
              onClick={openConfirmation}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="text-lg font-semibold">Delete Account</span>
              </div>
              <p className="text-gray-600">
                Remove your account from MyCity&apos;s system.
              </p>
            </button>
            {showConfirmation && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                <div className="bg-white p-4 rounded">
                  <p>
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </p>
                  <div className="mt-4 flex justify-center">
                    {/* Button to confirm deletion */}
                    <button
                      className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded mr-6"
                      onClick={handleDeleteAccount}
                    >
                      Delete
                    </button>
                    {/* Button to cancel */}
                    <button
                      className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "AccountInformation":
        return (
          <div className="ml-6 w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            {renderSubPageContent()}
          </div>
        );

      case "Notifications":
        return (
          <div className="ml-6 w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              {/* Enable Email Notifications */}
              <div className="flex items-center justify-between p-2 rounded">
                <span className="text-lg font-semibold">
                  Enable Email Notifications
                </span>
                <div
                  className={`relative w-12 h-6 rounded-full ${emailNotifications ? "bg-green-400" : "bg-gray-400"
                    }`}
                  onClick={toggleEmailNotifications}
                >
                  <div
                    className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${emailNotifications ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                  ></div>
                </div>
              </div>

              {/* Mute Notifications */}
              <div className="flex items-center justify-between mt-4 p-2 rounded">
                <span className="text-lg font-semibold">
                  Mute Notifications
                </span>
                <div
                  className={`relative w-12 h-6 rounded-full ${muteNotifications ? "bg-green-400" : "bg-gray-400"
                    }`}
                  onClick={toggleMuteNotifications}
                >
                  <div
                    className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${muteNotifications ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      case "SecurityPrivacy":
        return (
          <div className="ml-6 w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Security & Privacy</h2>
            <div className="space-y-4">
              {/* Enable Location Access */}
              <div className="flex items-center justify-between p-2 rounded">
                <span className="text-lg font-semibold">
                  Enable Location Access
                </span>
                <div
                  className={`relative w-12 h-6 rounded-full ${locationAccess ? "bg-green-400" : "bg-gray-400"
                    }`}
                  onClick={toggleLocationAccess}
                >
                  <div
                    className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${locationAccess ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                  ></div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between mt-4 p-2 rounded">
                <span className="text-lg font-semibold">
                  Two-Factor Authentication
                </span>
                <div
                  className={`relative w-12 h-6 rounded-full ${twoFactorAuth ? "bg-green-400" : "bg-gray-400"
                    }`}
                  onClick={toggleTwoFactorAuth}
                >
                  <div
                    className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${twoFactorAuth ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Accessibility":
        return (
          <div className="ml-6 w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-2 rounded">
                <span className="text-lg font-semibold">Dark Mode</span>
                <div
                  className={`relative w-12 h-6 rounded-full ${darkMode ? "bg-green-400" : "bg-gray-400"
                    }`}
                  onClick={toggleDarkMode}
                >
                  <div
                    className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${darkMode ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                  ></div>
                </div>
              </div>

              {/* Larger Font */}
              <div className="flex items-center justify-between mt-4 p-2 rounded">
                <span className="text-lg font-semibold">Larger Font</span>
                <div
                  className={`relative w-12 h-6 rounded-full ${largerFont ? "bg-green-400" : "bg-gray-400"
                    }`}
                  onClick={toggleLargerFont}
                >
                  <div
                    className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${largerFont ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      <NavbarUser />
      <main className="flex-1 bg-gray-100 p-6">
        <h1 className="text-4xl font-bold mb-2 mt-2 ml-2">Settings</h1>
        <div className="flex">
          <div className="w-64 bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-4">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={12}
                  height={12}
                  className="w-12 h-12 rounded-full mr-4"
                />
              ) : (
                <User className="w-12 h-12 rounded-full mr-4" />
              )}
              <div>
                <p className="text-lg font-semibold">{data?.given_name} {data?.family_name}</p>
              </div>
            </div>
            <nav>
              <a
                href="#"
                className={
                  activeTab === "AccountInformation"
                    ? "block py-2 px-4 rounded bg-gray-200"
                    : "block py-2 px-4 rounded hover:bg-gray-100"
                }
                onClick={() => setActiveTab("AccountInformation")}
              >
                Account Information
              </a>
              <a
                href="#"
                className={
                  activeTab === "Notifications"
                    ? "block py-2 px-4 rounded bg-gray-200"
                    : "block py-2 px-4 rounded hover:bg-gray-100"
                }
                onClick={() => setActiveTab("Notifications")}
              >
                Notifications
              </a>
              <a
                href="#"
                className={
                  activeTab === "SecurityPrivacy"
                    ? "block py-2 px-4 rounded bg-gray-200"
                    : "block py-2 px-4 rounded hover:bg-gray-100"
                }
                onClick={() => setActiveTab("SecurityPrivacy")}
              >
                Security &amp; Privacy
              </a>
              <a
                href="#"
                className={
                  activeTab === "Accessibility"
                    ? "block py-2 px-4 rounded bg-gray-200"
                    : "block py-2 px-4 rounded hover:bg-gray-100"
                }
                onClick={() => setActiveTab("Accessibility")}
              >
                Accessibility
              </a>
            </nav>
          </div>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}