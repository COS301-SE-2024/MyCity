import React from "react";
import { ArrowLeft, Edit2, Lock, User } from "lucide-react";

type ChangeAccountInfoProps = {
  onBack: () => void;
};

const ChangeAccountInfo: React.FC<ChangeAccountInfoProps> = ({ onBack }) => {
  return (
    <div className=" w-full bg-white rounded-lg p-1">
      <button
        className="flex items-center mb-4 text-gray-600 hover:text-gray-900"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="mb-4 flex flex-col items-center justify-center">
        <User className="h-24 w-24 rounded-full mb-2" />
        <button className="text-blue-600 hover:underline">Edit</button>
      </div>

      <div className="mb-4 text-center">
        <p className="text-gray-600 flex items-center justify-center">
          Email
          <Lock className="ml-2 h-4 w-4" />
        </p>
        <p className="text-xl font-semibold">kyle@email.com</p>
      </div>
      <div className="mb-4 text-center">
        <p className="text-gray-600">First Name(s)</p>
        <p className="text-xl font-semibold flex items-center justify-center">
          Kyle
          <Edit2 className="ml-2 h-4 w-4 cursor-pointer" />
        </p>
      </div>
      <div className="mb-4 text-center">
        <p className="text-gray-600">Surname</p>
        <p className="text-xl font-semibold flex items-center justify-center">
          Marshall
          <Edit2 className="ml-2 h-4 w-4 cursor-pointer" />
        </p>
      </div>
      <div className="mb-4 text-center">
        <p className="text-gray-600">Municipality</p>
        <p className="text-xl font-semibold flex items-center justify-center">
          City of Ekurhuleni Metropolitan Municipality
          <Edit2 className="ml-2 h-4 w-4 cursor-pointer" />
        </p>
      </div>
      <div className="flex justify-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ChangeAccountInfo;
