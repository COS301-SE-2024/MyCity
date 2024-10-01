"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarCompany from "@/components/Navbar/NavbarCompany";
import ChangeCompanyInfo from "@/components/Settings/company/ChangeCompanyInfo";
import ChangeCompanyPass from "@/components/Settings/company/ChangeCompanyPass";
import CompanyCode from "@/components/Settings/company/CompanyCode";
import { User, HelpCircle, XCircle } from "lucide-react";
import { Mail, BellOff, Moon, Text } from "lucide-react";
import NavbarMobile from "@/components/Navbar/NavbarMobile"; // Adding mobile navbar

type SubPage = "ChangeAccountInfo" | "ChangePassword" | "CompanyCode" | null;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("CompanyInformation");
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

  const toggleDarkMode = () => setDarkMode((prevState) => !prevState);
  const toggleLargerFont = () => setLargerFont((prevState) => !prevState);
  const toggleLocationAccess = () => setLocationAccess((prevState) => !prevState);
  const toggleTwoFactorAuth = () => setTwoFactorAuth((prevState) => !prevState);
  const toggleEmailNotifications = () => setEmailNotifications((prevState) => !prevState);
  const toggleMuteNotifications = () => setMuteNotifications((prevState) => !prevState);

  const handleDeleteAccount = () => {
    localStorage.clear();
    router.push("/");
  };

  const openConfirmation = () => setShowConfirmation(true);
  const toggleHelpMenu = () => setShowHelpMenu(!showHelpMenu);

  const renderSubPageContent = () => {
    switch (subPage) {
      case "ChangeAccountInfo":
        return <ChangeCompanyInfo onBack={() => setSubPage(null)} />;
      case "ChangePassword":
        return <ChangeCompanyPass onBack={() => setSubPage(null)} />;
      case "CompanyCode":
        return <CompanyCode />;
      default:
        return (
          <div className="space-y-4">
            <button className="w-full text-left hover:bg-gray-100 p-2 rounded" onClick={() => setSubPage("ChangeAccountInfo")}>
              <div className="flex items-center">
                <User className="h-6 w-6 text-black mr-2" />
                <span className="text-lg font-semibold">Change Company Information</span>
              </div>
              <p className="text-gray-600">See and change your company&apos;s information.</p>
            </button>
            <button className="w-full text-left hover:bg-gray-100 p-2 rounded" onClick={() => setSubPage("ChangePassword")}>
              <div className="flex items-center">
                <User className="h-6 w-6 text-black mr-2" />
                <span className="text-lg font-semibold">Change Employee Password</span>
              </div>
              <p className="text-gray-600">Change your password at any time.</p>
            </button>
            <button className="w-full text-left hover:bg-gray-100 p-2 rounded text-red-600" onClick={openConfirmation}>
              <div className="flex items-center">
                <User className="h-6 w-6 text-red-600 mr-2" />
                <span className="text-lg font-semibold">Delete Employee Account</span>
              </div>
              <p className="text-gray-600">Remove your account from MyCity&apos;s system.</p>
            </button>
            {showConfirmation && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                <div className="bg-white p-4 rounded">
                  <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                  <div className="mt-4 flex justify-center">
                    <button className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded mr-6" onClick={handleDeleteAccount}>
                      Delete
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={() => setShowConfirmation(false)}>
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
      case "CompanyInformation":
        return (
          <div className="w-full rounded-3xl sm:rounded-none sm:rounded-tr-lg sm:rounded-br-lg dark:bg-gray-700 dark:text-white bg-white bg-opacity-70 shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
            {renderSubPageContent()}
          </div>
        );
      case "Notifications":
        return (
          <div className="w-full rounded-3xl sm:rounded-none sm:rounded-tr-lg sm:rounded-br-lg dark:bg-gray-700 dark:text-white bg-white bg-opacity-70 shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                <div className="flex items-center justify-between p-2 rounded">
                  <Mail className="h-6 w-6 text-black mr-2" />
                  <span className="text-lg font-semibold">Enable Email Notifications</span>
                  <div className={`relative w-12 h-6 rounded-full ${emailNotifications ? "bg-green-400" : "bg-gray-400"}`} onClick={toggleEmailNotifications}>
                    <div className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${emailNotifications ? "translate-x-6" : "translate-x-0"} transition-transform`}></div>
                  </div>
                </div>
                <p className="text-gray-600">Enable or disable email notifications for various activities.</p>
              </div>
              <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                <div className="flex items-center justify-between p-2 rounded">
                  <BellOff className="h-6 w-6 text-black mr-2" />
                  <span className="text-lg font-semibold">Mute Notifications</span>
                  <div className={`relative w-12 h-6 rounded-full ${muteNotifications ? "bg-green-400" : "bg-gray-400"}`} onClick={toggleMuteNotifications}>
                    <div className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${muteNotifications ? "translate-x-6" : "translate-x-0"} transition-transform`}></div>
                  </div>
                </div>
                <p className="text-gray-600">Mute notifications for a specified period or permanently.</p>
              </div>
            </div>
          </div>
        );
      case "CompanyCode":
        return (
          <div className="w-full rounded-3xl sm:rounded-none sm:rounded-tr-lg sm:rounded-br-lg dark:bg-gray-700 dark:text-white bg-white bg-opacity-70 shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Company Code</h2>
            <CompanyCode />
          </div>
        );
      case "Accessibility":
        return (
          <div className="w-full rounded-3xl sm:rounded-none sm:rounded-tr-lg sm:rounded-br-lg dark:bg-gray-700 dark:text-white bg-white bg-opacity-70 shadow-md p-6 mr-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
            <div className="space-y-4">
              <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                <div className="flex items-center justify-between p-2 rounded">
                  <Moon className="h-6 w-6 text-black mr-2" />
                  <span className="text-lg font-semibold">Dark Mode</span>
                  <div className={`relative w-12 h-6 rounded-full ${darkMode ? "bg-green-400" : "bg-gray-400"}`} onClick={toggleDarkMode}>
                    <div className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${darkMode ? "translate-x-6" : "translate-x-0"} transition-transform`}></div>
                  </div>
                </div>
                <p className="text-gray-600">Toggle dark mode for a better viewing experience in low light.</p>
              </div>
              <div className="w-full text-left hover:bg-gray-100 p-2 rounded">
                <div className="flex items-center justify-between p-2 rounded">
                  <Text className="h-6 w-6 text-black mr-2" />
                  <span className="text-lg font-semibold">Larger Font</span>
                  <div className={`relative w-12 h-6 rounded-full ${largerFont ? "bg-green-400" : "bg-gray-400"}`} onClick={toggleLargerFont}>
                    <div className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform ${largerFont ? "translate-x-6" : "translate-x-0"} transition-transform`}></div>
                  </div>
                </div>
                <p className="text-gray-600">Enable larger font sizes for better readability.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const unreadNotifications = 74;

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <NavbarCompany unreadNotifications={unreadNotifications} />
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          zIndex: -1,
        }}></div>
        <main>
          <div className="flex items-center mb-2 mt-2 ml-2">
            <h1 className="text-4xl font-bold text-white text-opacity-80">Settings</h1>
          </div>
          <div className="flex">
            <div className="w-64 bg-white bg-opacity-80 rounded-tl-lg rounded-bl-lg shadow-md p-4 ml-6 mt-4">
              <div className="flex items-center mb-4">
                <User className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="text-lg font-semibold">Company Name</p>
                </div>
              </div>
              <nav>
                <a href="#" className={activeTab === "CompanyInformation" ? "block py-2 px-4 rounded bg-gray-200" : "block py-2 px-4 rounded hover:bg-gray-100"} onClick={() => { setActiveTab("CompanyInformation"); setSubPage(null); }}>
                  Company Information
                </a>
                <a href="#" className={activeTab === "Notifications" ? "block py-2 px-4 rounded bg-gray-200" : "block py-2 px-4 rounded hover:bg-gray-100"} onClick={() => { setActiveTab("Notifications"); setSubPage(null); }}>
                  Notifications
                </a>
                <a href="#" className={activeTab === "CompanyCode" ? "block py-2 px-4 rounded bg-gray-200" : "block py-2 px-4 rounded hover:bg-gray-100"} onClick={() => { setActiveTab("CompanyCode"); setSubPage("CompanyCode"); }}>
                  Company Code
                </a>
                <a href="#" className={activeTab === "Accessibility" ? "block py-2 px-4 rounded bg-gray-200" : "block py-2 px-4 rounded hover:bg-gray-100"} onClick={() => { setActiveTab("Accessibility"); setSubPage(null); }}>
                  Accessibility
                </a>
              </nav>
            </div>
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <NavbarCompany unreadNotifications={unreadNotifications} />
        <NavbarMobile />
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}></div>
        <main className="relative z-10 p-4">
          <h1 className="text-3xl font-bold text-white text-opacity-80 text-center mb-4">Settings</h1>

          <div className="dark:bg-gray-700 dark:text-white bg-white bg-opacity-80 rounded-t-lg shadow-md p-4 mb-0">
            <div className="flex items-center mb-4">
              <User className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="text-lg font-semibold">Company Name</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button className={`w-full text-left py-2 px-4 rounded-t ${activeTab === "CompanyInformation" ? "bg-gray-200" : "hover:bg-gray-100"}`} onClick={() => setActiveTab("CompanyInformation")}>
                Company Information
              </button>
              <button className={`w-full text-left py-2 px-4 ${activeTab === "Notifications" ? "bg-gray-200" : "hover:bg-gray-100"}`} onClick={() => setActiveTab("Notifications")}>
                Notifications
              </button>
              <button className={`w-full text-left py-2 px-4 ${activeTab === "CompanyCode" ? "bg-gray-200" : "hover:bg-gray-100"}`} onClick={() => setActiveTab("CompanyCode")}>
                Company Code
              </button>
              <button className={`w-full text-left py-2 px-4 rounded-b ${activeTab === "Accessibility" ? "bg-gray-200" : "hover:bg-gray-100"}`} onClick={() => setActiveTab("Accessibility")}>
                Accessibility
              </button>
            </nav>
          </div>

          <div className="dark:bg-gray-700 dark:text-white bg-white bg-opacity-80 rounded-b-lg shadow-md p-4 mt-0" style={{ paddingBottom: "80px", transition: "max-height 0.5s ease-out", overflow: "hidden", animation: "slide-down 0.5s ease-out forwards" }}>
            {renderTabContent()}
          </div>
        </main>

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

