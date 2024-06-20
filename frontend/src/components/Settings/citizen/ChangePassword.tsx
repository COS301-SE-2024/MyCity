import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

type ChangePasswordProps = {
  onBack: () => void;
};

const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const toggleOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmNewPassword = () => setShowConfirmNewPassword(!showConfirmNewPassword);

  return (
    <div className="w-full bg-white rounded-lg">
      <button
        className="flex items-center mb-4 text-gray-600 hover:text-gray-900"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <div className="mb-4 relative">
        <label className="block text-gray-700 mb-2" htmlFor="old-password">
          Old Password
        </label>
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            id="old-password"
            className="w-full border rounded p-2 pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-700"
            onClick={toggleOldPassword}
          >
            {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="mb-4 relative">
        <label className="block text-gray-700 mb-2" htmlFor="new-password">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            id="new-password"
            className="w-full border rounded p-2 pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-700"
            onClick={toggleNewPassword}
          >
            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="mb-4 relative">
        <label className="block text-gray-700 mb-2" htmlFor="confirm-new-password">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            id="confirm-new-password"
            className="w-full border rounded p-2 pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-700"
            onClick={toggleConfirmNewPassword}
          >
            {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
