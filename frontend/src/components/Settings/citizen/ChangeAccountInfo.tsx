import React, { useState, useRef, useEffect, FormEvent } from "react";
import { ArrowLeft, Edit2, Lock, User } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import { UserData } from "@/types/user.types";
import { useProfile } from "@/context/UserProfileContext";

type ChangeAccountInfoProps = {
  onBack: () => void;
  profileData: UserData | null;
};

const ChangeAccountInfo: React.FC<ChangeAccountInfoProps> = ({ onBack, profileData }) => {
  const [data, setData] = useState<UserData | null>(profileData);
  const [firstname, setFirstname] = useState(profileData?.given_name);
  const [surname, setSurname] = useState(profileData?.family_name);

  const { updateUserProfile } = useProfile();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;

        const updatedUserData: UserData = {
          sub: data?.sub,
          email: data?.email,
          given_name: data?.given_name,
          family_name: data?.family_name,
          picture: imageUrl,
          user_role: data?.user_role,
          municipality: data?.municipality
        };

        localStorage.setItem('profileImage', imageUrl);
        setData(updatedUserData);
        setFirstname(updatedUserData.given_name);
        setSurname(updatedUserData.family_name);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveChanges = () => {

    let updatedUserData = data;

    if (firstname) {
      if (updatedUserData) {
        updatedUserData.given_name = firstname;
      }
      localStorage.setItem('firstName', firstname);
    }

    if (surname) {
      if (updatedUserData) {
        updatedUserData.family_name = surname;
      }
      localStorage.setItem('surname', surname);
    }


    if (updatedUserData) {
      updateUserProfile(updatedUserData);
    }


    toast.success("Changes saved successfully!", {
      onClose: () => window.location.reload(),
    });
  };

  // useEffect(() => {
  //   const storedFirstName = localStorage.getItem('firstName');
  //   const storedSurname = localStorage.getItem('surname');
  //   const storedProfileImage = localStorage.getItem('profileImage');

  //   if (storedFirstName) setFirstName(storedFirstName);
  //   if (storedSurname) setSurname(storedSurname);
  //   if (storedProfileImage) setProfileImage(storedProfileImage);
  // }, []);

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
          {data?.picture ? (
            <img src={data?.picture} alt="Profile" width={24} height={24} className="h-24 w-24 rounded-full mb-2" />
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

        <div className="mb-4 text-center">
          <p className="text-gray-600 flex items-center justify-center">
            Email
            <Lock className="ml-2 h-4 w-4" />
          </p>
          <p className="text-xl font-semibold">{data?.email}</p>
        </div>
        <div className="mb-4 text-center">
          <p className="text-gray-600">First Name(s)</p>
          <div className="text-xl font-semibold flex items-center justify-center">
            <input
              type="text"
              value={firstname}
              name="given_name"
              onChange={(event)=>setFirstname(event.target.value)}
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
              value={surname}
              name="family_name"
              onChange={(event)=>setSurname(event.target.value)}
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
          <p className="text-xl font-semibold">{data?.municipality}</p>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
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
