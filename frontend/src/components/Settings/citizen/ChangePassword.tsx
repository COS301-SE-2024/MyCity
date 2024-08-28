import React, { FormEvent, useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { handleUpdatePassword } from "@/services/auth.service";

type ChangePasswordProps = {
  onBack: () => void;
};

const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const toggleOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmNewPassword = () =>
    setShowConfirmNewPassword(!showConfirmNewPassword);

  const validatePassword = (password: string) => {
    const passwordRules = [
      /[A-Z]/, // Uppercase letter
      /[a-z]/, // Lowercase letter
      /[0-9]/, // Digit
      /[!@#$%^&*]/, // Special character
      /.{8,}/, // Minimum length of 8
    ];
    return passwordRules.every((rule) => rule.test(password));
  };

  const checkPasswordMatch = (confirmPassword: string) => {
    setConfirmNewPassword(confirmPassword);
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
    } else {
      setPasswordError("");
    }
  };

  const handleSavePassword = async (event: FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character."
      );
      return;
    }

    setPasswordError("");

    try {
      const form = new FormData(event.currentTarget as HTMLFormElement);
      await handleUpdatePassword(form);
      alert("Password changed successfully!");
    } catch (error: any) {
      setPasswordError("Incorrect old password.");
    }
  };


  return (
    <div className="w-full rounded-lg p-4">
      <button
        className="flex items-center mb-4 text-gray-600 hover:text-gray-900"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>

      <form onSubmit={handleSavePassword}>
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2" htmlFor="old-password">
            Old Password
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              id="old-password"
              name="oldPassword"
              className="w-full border rounded-3xl p-2 pr-10"
              placeholder="Enter your old password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-700"
              onClick={toggleOldPassword}
            >
              {showOldPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
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
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-3xl p-2 pr-10"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-700"
              onClick={toggleNewPassword}
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-4 relative">
          <label
            className="block text-gray-700 mb-2"
            htmlFor="confirm-new-password"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              id="confirm-new-password"
              value={confirmNewPassword}
              onChange={(e) => checkPasswordMatch(e.target.value)}
              className="w-full border rounded-3xl p-2 pr-10"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-700"
              onClick={toggleConfirmNewPassword}
            >
              {showConfirmNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {passwordError && (
          <p className="text-red-500 text-center">{passwordError}</p>
        )}

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
