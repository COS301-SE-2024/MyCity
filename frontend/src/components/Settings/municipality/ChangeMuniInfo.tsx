import React, { useState, useRef } from "react";
import { ArrowLeft, Lock, User } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type ChangeMuniInfoProps = {
  onBack: () => void;
};

const ChangeMuniInfo: React.FC<ChangeMuniInfoProps> = ({ onBack }) => {
  const [data, setData] = useState({
    email: "mock@municipality.com",
    given_name: "Mock Firstname",
    family_name: "Mock Surname",
    picture: "",
    municipality: "Mock Municipality"
  });
  const [firstname, setFirstname] = useState(data.given_name);
  const [surname, setSurname] = useState(data.family_name);

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
    setData((prevData) => ({ ...prevData, given_name: firstname, family_name: surname }));
    localStorage.setItem('firstName', firstname);
    localStorage.setItem('surname', surname);

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
          <img src={data.picture} alt="Profile" width={24} height={24} className="h-24 w-24 rounded-full mb-2" />
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

      {/* First Name Input */}
      <div className="mb-4 text-center">
        <p className="text-gray-600">First Name(s)</p>
        <div className="text-xl font-semibold flex items-center justify-center">
          <input
            type="text"
            value={firstname}
            name="given_name"
            onChange={(event) => setFirstname(event.target.value)}
            className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 rounded-3xl px-4"
          />
        </div>
      </div>

      {/* Surname Input */}
      <div className="mb-4 text-center">
        <p className="text-gray-600">Surname</p>
        <div className="text-xl font-semibold flex items-center justify-center">
          <input
            type="text"
            value={surname}
            name="family_name"
            onChange={(event) => setSurname(event.target.value)}
            className="border-b-2 rounded-3xl border-gray-300 focus:outline-none focus:border-blue-500 px-4"
          />
        </div>
      </div>

      {/* Municipality Section */}
      <div className="mb-4 text-center">
        <p className="text-gray-600 flex items-center justify-center">
          Municipality
          <Lock className="ml-2 h-4 w-4" />
        </p>
        <p className="text-xl font-semibold">{data.municipality}</p>
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

export default ChangeMuniInfo;
