
import React from "react";

type ChangeAccountInfoProps = {
  onBack: () => void; // Define the type for onBack prop
};

const ChangeAccountInfo: React.FC<ChangeAccountInfoProps> = ({ onBack }) => {
  return (
    <div className="ml-6 w-full bg-white rounded-lg shadow-md p-6">
      <button
        className="flex items-center mb-4 text-gray-600 hover:text-gray-900"
        onClick={onBack}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11.414V14a1 1 0 11-2 0V6.586l-2.293 2.293a1 1 0 11-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 11-1.414 1.414L11 6.586z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Change Account Information</h2>
      <p>Here you can change your account information.</p>
    </div>
  );
};
  
    export default ChangeAccountInfo;