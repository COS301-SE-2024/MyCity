import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import Modal from "react-modal";

type ChangePasswordProps = {
  onBack: () => void;
};

const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isOldPasswordVerified, setIsOldPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const toggleOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmNewPassword = () =>
    setShowConfirmNewPassword(!showConfirmNewPassword);

  const handleVerifyOldPassword = () => {
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

    if (validatePassword(oldPassword)) {
      setIsOldPasswordVerified(true);
      setIsModalOpen(false);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect old password");
    }
  };

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

  const handleSaveChanges = () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character."
      );
      return;
    }
    // Save new password logic
    setPasswordError("");
    alert("Password changed successfully!");
  };

  const checkPasswordMatch = (confirmPassword: string) => {
    setConfirmNewPassword(confirmPassword);
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Verify Old Password"
        className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75"
      >
        <div className="bg-white p-4 rounded-lg shadow-lg relative">
          <button
            className="absolute top-2 right-2 text-gray-700"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={24} />
          </button>
          <h3 className="text-lg font-semibold mb-4">Enter Old Password</h3>
          <div className="mb-4 relative">
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border rounded p-2 pr-10"
              placeholder="Old Password"
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
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleVerifyOldPassword}
            >
              Verify
            </button>
          </div>
        </div>
      </Modal>

      {!isOldPasswordVerified && !isModalOpen && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Enter Old Password
          </button>
        </div>
      )}

      {isOldPasswordVerified && (
        <>
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2" htmlFor="new-password">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded p-2 pr-10"
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
                className="w-full border rounded p-2 pr-10"
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
          <div className="relative">
            {passwordError && (
              <p className="text-red-500 top-0 text-center">{passwordError}</p>
            )}
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 bottom-4"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChangePassword;
