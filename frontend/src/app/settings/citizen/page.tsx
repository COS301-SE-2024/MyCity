"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarUser from "@/components/Navbar/NavbarUser";
import ChangeAccountInfo from "@/components/Settings/citizen/ChangeAccountInfo";
import ChangePassword from "@/components/Settings/citizen/ChangePassword";
import { User, HelpCircle, XCircle } from "lucide-react";
import { Mail, BellOff, MapPin, Shield, Moon, Text } from "lucide-react";
import { UserData } from "@/types/custom.types";
import { useProfile } from "@/hooks/useProfile";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import ToggleTheme from "@/components/Theme/ToggleTheme";
type SubPage = "ChangeAccountInfo" | "ChangePassword" | null;
import LocationPrompt from "@/components/Location/LocationPrompt";
import Image from "next/image";

export default function Settings() {
  const { getUserProfile } = useProfile();
  const [data, setData] = useState<UserData | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [activeTab, setActiveTab] = useState("AccountInformation");
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [locationAccess, setLocationAccess] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [largerFont, setLargerFont] = useState(false);


  // const [profileImage, setProfileImage] = useState<string | null>(null);
  // const [firstName, setFirstName] = useState<string>("");
  // const [surname, setSurname] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    // Mock the unread notifications count with a random number
    const mockUnreadNotifications = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    setUnreadNotifications(mockUnreadNotifications);
  }, []);

  useEffect(() => {
    const getProfileData = async () => {
      const profile = await getUserProfile();

      if (profile.current) {
        const storedProfileImage = localStorage.getItem("profileImage")
          ? localStorage.getItem("profileImage")!
          : undefined;
        const storedFirstName = localStorage.getItem("firstName")
          ? localStorage.getItem("firstName")!
          : undefined;
        const storedSurname = localStorage.getItem("surname")
          ? localStorage.getItem("surname")!
          : undefined;

        const updatedUserData: UserData = {
          sub: profile.current.sub,
          email: profile.current.email,
          given_name: profile.current.given_name
            ? profile.current.given_name
            : storedFirstName,
          family_name: profile.current.family_name
            ? profile.current.family_name
            : storedSurname,
          picture: profile.current.picture
            ? profile.current.picture
            : storedProfileImage,
          user_role: profile.current.user_role,
          municipality: profile.current.municipality,
        };

        setData(updatedUserData);
      }
    };

    // if (storedProfileImage) setProfileImage(storedProfileImage);
    // if (storedFirstName) setFirstName(storedFirstName);
    // if (storedSurname) setSurname(storedSurname);

    getProfileData();
  }, [getUserProfile]);

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
    localStorage.clear();
    router.push("/");
  };

  const openConfirmation = () => {
    setShowConfirmation(true);
  };

  const toggleHelpMenu = () => {
    setShowHelpMenu(!showHelpMenu);
  };

  const renderSubPageContent = (profile: UserData | null) => {
    switch (subPage) {
      case "ChangeAccountInfo":
        return (
          <ChangeAccountInfo
            profileData={profile}
            onBack={() => setSubPage(null)}
          />
        );
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
                <div className="dark:bg-gray-700 dark:text-white bg-white p-4 rounded">
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
          <div className="w-full dark:bg-gray-700 dark:text-white bg-white bg-opacity-70 sm:rounded-tr-lg sm:rounded-br-lg shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            {renderSubPageContent(data)}
          </div>
        );

      case "Notifications":
        return (
          <div className=" w-full dark:bg-gray-700 dark:text-white bg-white bg-opacity-70 sm:rounded-tr-lg sm:rounded-br-lg  shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                <div className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-black mr-2" />
                    <span className="text-lg font-semibold">
                      Enable Email Notifications
                    </span>
                  </div>
                  <div
                    className={`relative w-12 h-6 rounded-full ${
                      emailNotifications ? "bg-green-400" : "bg-gray-400"
                    }`}
                    onClick={toggleEmailNotifications}
                  >
                    <div
                      className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${
                        emailNotifications ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                    ></div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Enable or disable email notifications for various activities.
                </p>
              </div>

              <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                <div className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center">
                    <BellOff className="h-6 w-6 text-black mr-2" />
                    <span className="text-lg font-semibold">
                      Mute Notifications
                    </span>
                  </div>
                  <div
                    className={`relative w-12 h-6 rounded-full ${
                      muteNotifications ? "bg-green-400" : "bg-gray-400"
                    }`}
                    onClick={toggleMuteNotifications}
                  >
                    <div
                      className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${
                        muteNotifications ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                    ></div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Mute notifications for a specified period or permanently.
                </p>
              </div>
            </div>
          </div>
        );

        case "SecurityPrivacy":
          return (
            <div className=" w-full dark:bg-gray-700 dark:text-white bg-white bg-opacity-70 sm:rounded-tr-lg sm:rounded-br-lg shadow-md p-6 mr-6 mt-4">
              <h2 className="text-2xl font-semibold mb-4">Security & Privacy</h2>
              <div className="space-y-4">
                <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                  <div className="flex items-center justify-between p-2 rounded">
                    <div className="flex items-center">
                      <MapPin className="h-6 w-6 text-black mr-2" />
                      <span className="text-lg font-semibold">
                        Enable Location Access
                      </span>
                    </div>
                    <div
                      className={`relative w-12 h-6 rounded-full ${
                        locationAccess ? "bg-green-400" : "bg-gray-400"
                      }`}
                      onClick={toggleLocationAccess} // Toggle access
                    >
                      <div
                        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${
                          locationAccess ? "translate-x-6" : "translate-x-0"
                        } transition-transform`}
                      ></div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Enable or disable location access for better service recommendations.
                  </p>
                </div>
  
                {/* Conditionally render LocationPrompt */}
                {locationAccess && <LocationPrompt />}
              </div>
            </div>
          );

      case "Accessibility":
        return (
          <div className="w-full dark:bg-gray-700 dark:text-white bg-white  bg-opacity-70 sm:rounded-tr-lg sm:rounded-br-lg shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
            <div className="space-y-4">
              <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                <div className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center">
                    <Moon className="h-6 w-6 text-black mr-2" />
                    <span className="text-lg font-semibold">Dark Mode</span>
                  </div>

                  <ToggleTheme />
                </div>
                <p className="dark:text-gray-200 text-gray-600">
                  Toggle dark mode for a better viewing experience in low light.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex w-full h-full">
          <NavbarUser unreadNotifications={unreadNotifications} />
          <div
            style={{
              position: "fixed", // Change position to 'fixed'
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed", // Ensures the background is fixed regardless of scrolling
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>
          <main className="w-full h-full">
            <div className="flex items-center mb-2 mt-2 ml-2">
              <div className="flex items-center mb-2 mt-6 ml-9 pt-15">
                <h1 className="text-4xl font-bold text-white text-opacity-80">
                  Settings
                </h1>
              </div>
            </div>

            <div className="flex items-center mb-2 mt-2 ml-2">
              <button data-testid="open-help-menu" onClick={toggleHelpMenu}>
                <HelpCircle
                  className="ml-2 fixed bottom-4 right-4 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
                  size={24}
                />
              </button>
            </div>

            {showHelpMenu && (
              <div
                data-testid="help"
                className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
              >
                <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-700"
                    onClick={toggleHelpMenu}
                  >
                    <XCircle size={24} data-testid="close-help-menu" />
                  </button>
                  <h2 className="text-xl font-bold mb-4">Help Menu</h2>
                  <p>This settings page allows you to:</p>
                  <ul className="list-disc list-inside">
                    <li>Change your account information.</li>
                    <li>Change your password.</li>
                    <li>Manage notification settings.</li>
                    <li>Configure security and privacy options.</li>
                    <li>Adjust accessibility settings.</li>
                  </ul>
                  <p>
                    Use the tabs on the left to navigate between different
                    sections.
                  </p>
                </div>
              </div>
            )}

            <div className="flex w-full justify-center ">
              <div className="flex w-[80%] ">
                <div className="w-[30%] dark:bg-gray-700 dark:text-white  bg-white bg-opacity-80 rounded-tl-lg rounded-bl-lg shadow-md p-4 ml-6 mt-4">
                  <div className="flex w-full items-center mb-4">
                    {data?.picture ? (
                      <Image
                        src={data?.picture}
                        alt="Profile"
                        width={12}
                        height={12}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    ) : (
                      <User className="w-12 h-12 rounded-full mr-4" />
                    )}
                    <div>
                      {/* <p className="text-lg font-semibold">{firstName} {surname}</p> */}
                      <p className="text-lg font-semibold">
                        {data?.given_name} {data?.family_name}
                      </p>
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
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <NavbarUser unreadNotifications={unreadNotifications} />
        <NavbarMobile />
        {/* Background Image */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: -1,
          }}
        ></div>

        <main className="relative z-10 p-4">
          <h1 className="text-3xl font-bold text-white text-opacity-80 text-center mb-4">
            Settings
          </h1>

          {/* Profile and Tabs */}
          <div className="dark:bg-gray-700 dark:text-white bg-white bg-opacity-80 rounded-t-lg shadow-md p-4 mb-0">
            <div className="flex items-center mb-4">
              {data?.picture ? (
                <Image
                  src={data?.picture}
                  alt="Profile"
                  width={12}
                  height={12}
                  className="w-12 h-12 rounded-full mr-4"
                />
              ) : (
                <User className="w-12 h-12 rounded-full mr-4" />
              )}
              <div>
                <p className="text-lg font-semibold">
                  {data?.given_name} {data?.family_name}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <nav className="space-y-2">
              <button
                className={`w-full text-left py-2 px-4 rounded-t ${
                  activeTab === "AccountInformation"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("AccountInformation")}
              >
                Account Information
              </button>
              <button
                className={`w-full text-left py-2 px-4 ${
                  activeTab === "Notifications"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("Notifications")}
              >
                Notifications
              </button>
              <button
                className={`w-full text-left py-2 px-4 ${
                  activeTab === "SecurityPrivacy"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("SecurityPrivacy")}
              >
                Security & Privacy
              </button>
              <button
                className={`w-full text-left py-2 px-4 rounded-b ${
                  activeTab === "Accessibility"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("Accessibility")}
              >
                Accessibility
              </button>
            </nav>
          </div>

          {/* Tab Content with Extra Padding at the Bottom for Scroll */}
          <div
            className="dark:bg-gray-700 dark:text-white bg-white bg-opacity-80 rounded-b-lg shadow-md p-4 mt-0"
            style={{
              paddingBottom: "80px", // Add extra padding at the bottom
              transition: "max-height 0.5s ease-out",
              overflow: "hidden",
              animation: "slide-down 0.5s ease-out forwards",
            }}
          >
            {renderTabContent()}
          </div>
        </main>

        {/* Style for the slide-down animation */}
        <style jsx>{`
          @keyframes slide-down {
            0% {
              max-height: 0;
              opacity: 0;
            }
            100% {
              max-height: 100vh;
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
