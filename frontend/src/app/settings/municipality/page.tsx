"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import ChangeMuniInfo from "@/components/Settings/municipality/ChangeMuniInfo";
import ChangeMuniPass from "@/components/Settings/municipality/ChangeMuniPass";
import Municode from "@/components/Settings/municipality/municode";
import { User, HelpCircle, XCircle } from "lucide-react";
import { Mail, BellOff, Moon, Text } from "lucide-react";

type SubPage = "ChangeAccountInfo" | "ChangePassword" | "Municode" | null;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("MunicipalityInformation");
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [locationAccess, setLocationAccess] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [largerFont, setLargerFont] = useState(false);

  const router = useRouter();

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
    localStorage.clear();
    router.push("/");
  };

  const openConfirmation = () => {
    setShowConfirmation(true);
  };

  const toggleHelpMenu = () => {
    setShowHelpMenu(!showHelpMenu);
  };

  const renderSubPageContent = () => {
    switch (subPage) {
      case "ChangeAccountInfo":
        return <ChangeMuniInfo onBack={() => setSubPage(null)} />;
      case "ChangePassword":
        return <ChangeMuniPass onBack={() => setSubPage(null)} />;
      case "Municode":
        return <Municode />;
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
                  Change Municipality Information
                </span>
              </div>
              <p className="text-gray-600">
                See and change your municipality&apos;s information.
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
                <span className="text-lg font-semibold">
                  Change Employee Password
                </span>
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
                <span className="text-lg font-semibold">
                  Delete Employee Account
                </span>
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
                    <button
                      className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded mr-6"
                      onClick={handleDeleteAccount}
                    >
                      Delete
                    </button>
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
      case "MunicipalityInformation":
        return (
          <div className="border-l border-gray-400 w-full bg-white bg-opacity-70 rounded-tr-lg rounded-br-lg shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">
              Municipality Information
            </h2>
            {renderSubPageContent()}
          </div>
        );

      case "Notifications":
        return (
          <div className="border-l border-gray-400 w-full bg-white bg-opacity-70 rounded-tr-lg rounded-br-lg shadow-md p-6 mr-6 mt-4">
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

      case "Municode":
        return (
          <div className="border-l border-gray-400 w-full bg-white bg-opacity-70 rounded-tr-lg rounded-br-lg shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Municode</h2>
            {renderSubPageContent()}
          </div>
        );

      case "Accessibility":
        return (
          <div className="border-l border-gray-400 w-full bg-white bg-opacity-70 rounded-tr-lg rounded-br-lg shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
            <div className="space-y-4">
              <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                <div className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center">
                    <Moon className="h-6 w-6 text-black mr-2" />
                    <span className="text-lg font-semibold">Dark Mode</span>
                  </div>
                  <div
                    className={`relative w-12 h-6 rounded-full ${
                      darkMode ? "bg-green-400" : "bg-gray-400"
                    }`}
                    onClick={toggleDarkMode}
                  >
                    <div
                      className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${
                        darkMode ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                    ></div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Toggle dark mode for a better viewing experience in low light.
                </p>
              </div>

              <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                <div className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center">
                    <Text className="h-6 w-6 text-black mr-2" />
                    <span className="text-lg font-semibold">Larger Font</span>
                  </div>
                  <div
                    className={`relative w-12 h-6 rounded-full ${
                      largerFont ? "bg-green-400" : "bg-gray-400"
                    }`}
                    onClick={toggleLargerFont}
                  >
                    <div
                      className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${
                        largerFont ? "translate-x-6" : "translate-x-0"
                      } transition-transform`}
                    ></div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Enable larger font sizes for better readability.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  const unreadNotifications = Math.floor(Math.random() * 10) + 1;
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <NavbarMunicipality unreadNotifications={unreadNotifications} />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              zIndex: -1,
            }}
          ></div>
          <main>
            <div className="flex items-center mb-2 mt-2 ml-2">
              <div className="flex items-center mb-2 mt-6 ml-9 pt-15">
                <h1 className="text-4xl font-bold text-white text-opacity-80">
                  Settings
                </h1>
              </div>
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
                    <li>Change your municipality information.</li>
                    <li>Change your employee password.</li>
                    <li>Manage notification settings.</li>
                    <li>Configure Municode settings.</li>
                    <li>Adjust accessibility settings.</li>
                  </ul>
                  <p>
                    Use the tabs on the left to navigate between different
                    sections.
                  </p>
                </div>
              </div>
            )}

            <div className="flex">
              <div className="w-64 bg-white bg-opacity-80 rounded-tl-lg rounded-bl-lg shadow-md p-4 ml-6 mt-4">
                <div className="flex items-center mb-4">
                  <User className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="text-lg font-semibold">Municipality Name</p>
                  </div>
                </div>
                <nav>
                  <a
                    href="#"
                    className={
                      activeTab === "MunicipalityInformation"
                        ? "block py-2 px-4 rounded bg-gray-200"
                        : "block py-2 px-4 rounded hover:bg-gray-100"
                    }
                    onClick={() => {
                      setActiveTab("MunicipalityInformation");
                      setSubPage(null);
                    }}
                  >
                    Municipality Information
                  </a>
                  <a
                    href="#"
                    className={
                      activeTab === "Notifications"
                        ? "block py-2 px-4 rounded bg-gray-200"
                        : "block py-2 px-4 rounded hover:bg-gray-100"
                    }
                    onClick={() => {
                      setActiveTab("Notifications");
                      setSubPage(null);
                    }}
                  >
                    Notifications
                  </a>
                  <a
                    href="#"
                    className={
                      activeTab === "Municode"
                        ? "block py-2 px-4 rounded bg-gray-200"
                        : "block py-2 px-4 rounded hover:bg-gray-100"
                    }
                    onClick={() => {
                      setActiveTab("Municode");
                      setSubPage("Municode");
                    }}
                  >
                    Municode
                  </a>
                  <a
                    href="#"
                    className={
                      activeTab === "Accessibility"
                        ? "block py-2 px-4 rounded bg-gray-200"
                        : "block py-2 px-4 rounded hover:bg-gray-100"
                    }
                    onClick={() => {
                      setActiveTab("Accessibility");
                      setSubPage(null);
                    }}
                  >
                    Accessibility
                  </a>
                </nav>
              </div>
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden", // Prevents content overflow
          }}
        >
          <div className="text-white font-bold ms-2 transform hover:scale-105 mt-5 ml-5 transition-transform duration-200">
            <img
              src="https://i.imgur.com/WbMLivx.png"
              alt="MyCity"
              width={100}
              height={100}
              className="w-100 h-100"
            />
          </div>

          {/* Background image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10">
            {" "}
            {/* Ensure content is above the background */}
            <h1 className="text-4xl text-white font-bold mb-4 ml-4">
              <span className="text-blue-200">MyCity</span> <br />
              Under Construction
            </h1>
            <div className="text-white font-bold transform hover:scale-105 transition-transform duration-200 flex justify-center">
              <img
                src="https://i.imgur.com/eGeTTuo.png"
                alt="Under-Construction"
                width={300}
                height={300}
              />
            </div>
            <p className="text-lg text-gray-200 mb-4 ml-4">
              Our Mobile site is currently under construction.
              <br />
              Please use our Desktop site while we
              <br />
              work on it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
