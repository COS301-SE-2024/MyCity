import React, { useState, useRef, useEffect, FormEvent } from "react";
import { ArrowLeft, Lock, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserData } from "@/types/custom.types";
import { useProfile } from "@/hooks/useProfile";
import { uploadProfilePicture } from "@/services/users.service";


type ChangeAccountInfoProps = {
  onBack: () => void;
  profileData: UserData | null;
};

const ChangeAccountInfo: React.FC<ChangeAccountInfoProps> = ({
  onBack,
  profileData,
}) => {
  const [data, setData] = useState<UserData | null>(profileData);
  const [firstname, setFirstname] = useState(profileData?.given_name);
  const [surname, setSurname] = useState(profileData?.family_name);
  const [file, setFile] = useState<File>();

  const { updateUserProfile } = useProfile();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);

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
          municipality: data?.municipality,
        };

        setData(updatedUserData);
        setFirstname(updatedUserData.given_name);
        setSurname(updatedUserData.family_name);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    let updatedUserData = data;

    if (!updatedUserData) {
      return;
    }

    if (firstname && firstname != data?.given_name) {
      updatedUserData.given_name = firstname;
    }

    if (surname && surname != data?.family_name) {
      updatedUserData.family_name = surname;
    }

    // upload profile picture
    if (file && data?.email) {
      const formData = new FormData();
      formData.append("username", data?.email);
      formData.append("file", file);

      try {
        const sessionToken = data.session_token;
        const pictureUrl = await uploadProfilePicture(sessionToken, formData);
        updatedUserData.picture = pictureUrl;
      } catch (error: any) {
        console.log(error.message);
      }
    }

    // upload user new profile details
    if (updatedUserData) {
      updateUserProfile(updatedUserData);
    }

    toast.success("Changes saved successfully!", {
      onClose: () => window.location.reload(),
    });
  };

  // Truncate email if it's too long
  const truncateEmail = (email: string | undefined, length = 30) => {
    if (!email) return "";
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
        {data?.picture ? (
          <img
            src={data?.picture}
            alt="Profile"
            width={24}
            height={24}
            className="h-24 w-24 rounded-full mb-2"
          />
        ) : (
          <User className="h-24 w-24 rounded-full mb-2" />
        )}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => fileInputRef.current?.click()}
        >
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
          title={data?.email} // Tooltip with the full email
        >
          {truncateEmail(data?.email)}
        </p>
      </div>

      {/* First Name */}
      <div className="mb-4 text-center">
        <p className="text-gray-600">First Name(s)</p>
        <div className="text-xl font-semibold flex items-center justify-center">
          <input
            type="text"
            value={firstname}
            name="given_name"
            onChange={(event) => setFirstname(event.target.value)}
            className="rounded-3xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Surname */}
      <div className="mb-4 text-center">
        <p className="text-gray-600">Surname</p>
        <div className="text-xl font-semibold flex items-center justify-center">
          <input
            type="text"
            value={surname}
            name="family_name"
            onChange={(event) => setSurname(event.target.value)}
            className="rounded-3xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Municipality */}
      <div className="mb-4 text-center">
        <p className="text-gray-600 flex items-center justify-center">
          Municipality
          <Lock className="ml-2 h-4 w-4" />
        </p>
        <p className="text-xl font-semibold">{data?.municipality}</p>
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

export default ChangeAccountInfo;
