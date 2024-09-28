import React, { useState, useRef } from "react";
import { ArrowLeft, Lock, User } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";

type ChangeCompanyInfoProps = {
  onBack: () => void;
};

const ChangeCompanyInfo: React.FC<ChangeCompanyInfoProps> = ({ onBack }) => {
  const [data, setData] = useState({
    email: "mock@company.com",
    picture: "",
    company: "Mock Company"
  });

  const [company, setCompany] = useState(data.company);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setData((prevData) => ({ ...prevData, picture: imageUrl }));
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    setData((prevData) => ({ ...prevData, company }));
    localStorage.setItem('company', company);

    toast.success("Changes saved successfully!");
  };

  // Truncate email if it's too long
  const truncateEmail = (email: string, length = 30) => {
    return email.length > length ? `${email.slice(0, length)}...` : email;
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

      <div className="mb-4 flex flex-col items-center justify-center">
        {data.picture ? (
          <Image src={data.picture} alt="Profile" width={24} height={24} className="h-24 w-24 rounded-full mb-2" />
        ) : (
          <User className="h-24 w-24 rounded-full mb-2" />
        )}
        <button className="text-blue-600 hover:underline" onClick={() => fileInputRef.current?.click()}>
          Edit
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          name="picture"
          onChange={handleImageChange}
        />
      </div>

      {/* Email Section with Tooltip */}
      <div className="mb-4 text-center">
        <p className="text-gray-600 flex items-center justify-center">
          Email
          <Lock className="ml-2 h-4 w-4" />
        </p>
        <p
          className="text-xl font-semibold cursor-pointer"
          title={data.email} // Tooltip with full email
        >
          {truncateEmail(data.email)}
        </p>
      </div>

      {/* Company Name */}
      <div className="mb-4 text-center">
        <p className="text-gray-600">Company Name</p>
        <div className="text-xl font-semibold flex items-center justify-center">
          <input
            type="text"
            value={company}
            name="company"
            onChange={(event) => setCompany(event.target.value)}
            className="border-b-2 border-gray-300 focus:outline-none rounded-3xl focus:border-blue-500"
          />
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangeCompanyInfo;
