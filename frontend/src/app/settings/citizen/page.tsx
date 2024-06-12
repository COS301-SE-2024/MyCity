'use client'

import React, { useState } from 'react';
import NavbarUser from '@/components/Navbar/NavbarUser';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('AccountInformation');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'AccountInformation':
        return (
          <div className="ml-6 w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500 mr-2"
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
                <span className="text-lg font-semibold">Change Account Information</span>
              </div>
              <p className="text-gray-600">See and change your account&apos;s information.</p>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500 mr-2"
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
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500 mr-2"
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
              <p className="text-gray-600">Remove your account from MyCity&apos;s system.</p>
            </div>
          </div>
        );
      case 'Notifications':
        return (
            <div className="ml-6 w-full bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Enable Email Notifications</span>
                  <input type="checkbox" className="form-checkbox" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Mute Notifications</span>
                  <input type="checkbox" className="form-checkbox" />
                </div>
              </div>
            </div>
          );
      case 'SecurityPrivacy':
        return (
          <div className="ml-6 w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Security & Privacy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Enable Location Access</span>
                <input type="checkbox" className="form-checkbox" />
              </div>
              <div className="flex items-center justify-between">
                <span>Two Factor Authentication</span>
                <input type="checkbox" className="form-checkbox" />
              </div>
            </div>
          </div>
        );
      case 'Accessibility':
        return (
          <div className="ml-6 w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <input type="checkbox" className="form-checkbox" />
              </div>
              <div className="flex items-center justify-between">
                <span>Larger Font</span>
                <input type="checkbox" className="form-checkbox" />
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
              <img src="/profile.png" alt="Profile" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="text-lg font-semibold">Kyle Marshall</p>
              </div>
            </div>
            <nav>
              <a href="#" className={activeTab === 'AccountInformation' ? 'block py-2 px-4 rounded bg-gray-200' : 'block py-2 px-4 rounded hover:bg-gray-100'} onClick={() => setActiveTab('AccountInformation')}>
                Account Information
              </a>
              <a href="#" className={activeTab === 'Notifications' ? 'block py-2 px-4 rounded bg-gray-200' : 'block py-2 px-4 rounded hover:bg-gray-100'} onClick={() => setActiveTab('Notifications')}>
                Notifications
              </a>
              <a href="#" className={activeTab === 'SecurityPrivacy' ? 'block py-2 px-4 rounded bg-gray-200' : 'block py-2 px-4 rounded hover:bg-gray-100'} onClick={() => setActiveTab('SecurityPrivacy')}>
                Security &amp; Privacy
              </a>
              <a href="#" className={activeTab === 'Accessibility' ? 'block py-2 px-4 rounded bg-gray-200' : 'block py-2 px-4 rounded hover:bg-gray-100'} onClick={() => setActiveTab('Accessibility')}>
                Accessibility
              </a>
            </nav>
          </div>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Settings;
