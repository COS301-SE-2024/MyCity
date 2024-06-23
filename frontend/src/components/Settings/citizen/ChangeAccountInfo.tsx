import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Edit2, Lock, User } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import { UserData } from "@/types/user.types";

type ChangeAccountInfoProps = {
  onBack: () => void;
  profileData: UserData | null;
};

const ChangeAccountInfo: React.FC<ChangeAccountInfoProps> = ({ onBack }) => {
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || "Jane");
  const [surname, setSurname] = useState(localStorage.getItem('surname') || "Doe");
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('surname', surname);
    toast.success("Changes saved successfully!", {
      onClose: () => window.location.reload(),
    });
  };

  useEffect(() => {
    const storedFirstName = localStorage.getItem('firstName');
    const storedSurname = localStorage.getItem('surname');
    const storedProfileImage = localStorage.getItem('profileImage');

    if (storedFirstName) setFirstName(storedFirstName);
    if (storedSurname) setSurname(storedSurname);
    if (storedProfileImage) setProfileImage(storedProfileImage);
  }, []);

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
        {profileData?.picture ? (
          <img src={profileData?.picture} alt="Profile" width={24} height={24} className="h-24 w-24 rounded-full mb-2" />
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
          onChange={handleImageChange}
        />
      </div>

      <div className="mb-4 text-center">
        <p className="text-gray-600 flex items-center justify-center">
          Email
          <Lock className="ml-2 h-4 w-4" />
        </p>
        <p className="text-xl font-semibold">{profileData?.email}</p>
      </div>
      <div className="mb-4 text-center">
        <p className="text-gray-600">First Name(s)</p>
        <div className="text-xl font-semibold flex items-center justify-center">
          <input
            type="text"
            value={profileData?.given_name}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <Edit2 className="ml-2 h-4 w-4 cursor-pointer" />
        </div>
      </div>
      <div className="mb-4 text-center">
        <p className="text-gray-600">Surname</p>
        <div className="text-xl font-semibold flex items-center justify-center">
          <input
            type="text"
            value={profileData?.given_name}
            onChange={(e) => setSurname(e.target.value)}
            className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <Edit2 className="ml-2 h-4 w-4 cursor-pointer" />
        </div>
      </div>
      <div className="mb-4 text-center">
        <p className="text-gray-600 flex items-center justify-center">
          Municipality
          <Lock className="ml-2 h-4 w-4" />
        </p>
        <p className="text-xl font-semibold">{profileData?.}</p>
      </div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangeAccountInfo;
