"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Import Image from next/image
import Navbar from "@/components/Navbar/Navbar";
import { getGiveawayEntries, AddEntry } from "@/services/giveaway.service"; // Import the getGiveawayEntries function from the giveaway service
import { useProfile } from "@/hooks/useProfile";

interface EntriesType {
  count: number;
}

export default function Giveaway() {
  const userProfile = useProfile();
  const [entries, setEntries] = useState<EntriesType | null>(null);
  const [formData, setFormData] = useState({
    ticketNumber: "",
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted", formData);
  };

  // Fetch the number of giveaway entries
  useEffect(() => {
    const fetchData = async () => {
      const user_data = await userProfile.getUserProfile();
      const userSession = user_data.current?.session_token;

      async function fetchEntries() {
        if (userSession) {
          // Check if userSession is defined
          try {
            const response = await getGiveawayEntries(userSession); // Your API endpoint
            console.log("Response:", response);
            setEntries(response);
          } catch (error) {
            console.error("Error fetching entries:", error);
          }
        } else {
          console.error("User session is undefined");
        }
      }

      fetchEntries();
    };

    fetchData();
  }, []);

  const setEntry = async (
    ticketNumber: string,
    name: string,
    email: string,
    phoneNumber: string
  ) => {
    const user_data = await userProfile.getUserProfile();
    const userSession = user_data.current?.session_token;

    async function addEntries(
      ticketNumber: string,
      name: string,
      email: string,
      phoneNumber: string
    ) {
      if (userSession) {
        // Check if userSession is defined
        try {
          const response = await AddEntry(ticketNumber, name, email, phoneNumber, userSession); // Your API endpoint
          console.log("Response:", response);
        } catch (error) {
          console.error("Error adding entry:", error);
        }
      } else {
        console.error("User session is undefined");
      }
    }

    addEntries(ticketNumber, name, email, phoneNumber);
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <Navbar showLogin={true} />

        {/* Background Image */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            zIndex: -1,
          }}
        ></div>

        <main className="relative">
          {/* Page Title */}
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 text-center mt-28 mb-8 py-2 animate-pulse">
            Giveaway!
          </h1>

          {/* Giveaway Details */}
          <div className="text-white text-opacity-90 mt-16 px-20 space-y-10">
            {/* Prize Cards */}
            <div className="grid grid-cols-3 gap-6">
              {/* Middle Prize */}
              <div className="bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/giveaway/Umbrella.webp"
                  alt="Middle Prize"
                  width={500}
                  height={500}
                  className="w-full object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-bold mb-1">
                  DPG Branded Golf Umbrella
                </h3>
                <h3 className="text-lg font-bold mb-3">
                  (12x Valued at over R200)
                </h3>
                <ul className="list-disc ml-6 text-sm space-y-2">
                  <li>Large 8 Panel design</li>
                  <li>Comfortable EVA Handle</li>
                  <li>Navy Blue 127cm Golf Umbrella with DPG Branding</li>
                  <li>190T Polyester</li>
                </ul>
              </div>

              {/* Main Prize */}
              <div className="bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/giveaway/Pelican-1030.webp"
                  alt="Main Prize"
                  width={500}
                  height={500}
                  className="w-full object-cover rounded-md mb-4"
                />

                <h3 className="text-xl font-bold mb-1">
                  Pelican™ 1030 Micro Case
                </h3>
                <h3 className="text-lg font-bold mb-3">
                  (1x Valued at over R1000)
                </h3>
                <ul className="list-disc ml-6 text-sm space-y-2">
                  <li>IP67 Watertight, crushproof, dustproof</li>
                  <li>Submersible up to 1 meter for 30 minutes</li>
                  <li>Automatic Pressure Equalization Valve</li>
                  <li>Lifetime guarantee, carabiner, easy-open latch</li>
                </ul>
              </div>

              {/* Final Prize */}
              <div className="bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/giveaway/Sticker.webp"
                  alt="Final Prize"
                  width={500}
                  height={500}
                  className="w-full object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-bold mb-1">MyCity Logo Sticker</h3>
                <h3 className="text-lg font-bold mb-3">
                  (The first 100 valid entries will receive a sticker)
                </h3>
                <ul className="list-disc ml-6 text-sm space-y-2">
                  <li>Step 1: Enter the Giveaway.</li>
                  <li>Step 2: Show a MyCity team member your valid entry.</li>
                  <li>
                    Step 3: Get a sticker as a sign of our appreciation for your
                    support.
                  </li>
                  <li>40x40mm sticker</li>
                </ul>
              </div>
            </div>

            {/* Entries Section */}
            <h2 className="text-3xl font-bold mt-16 text-center">
              Current Number of Entries
            </h2>
            <div className="text-lg bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-md text-center">
              {entries !== null ? (
                typeof entries === "object" && "count" in entries ? (
                  <p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 text-center py-2 animate-pulse">
                    {entries.count}
                  </p>
                ) : (
                  <p className="">Invalid data format</p>
                )
              ) : (
                <p className="">Loading...</p>
              )}
            </div>

            {/* Split the width into two columns */}
            <div className="grid grid-cols-2 gap-10">
              {/* Left Column: Entry Form */}
              <div className="bg-gray-700 bg-opacity-70 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mt-2 mb-6 text-center">
                  MyCity Giveaway Rules
                </h2>

                <h3 className="text-md font-bold mb-4">Eligibility:</h3>
                <ul className="text-sm list-disc ml-6 space-y-2">
                  <li>
                    Open to legal residents who are 18 years or older at the
                    time of entry.
                  </li>
                  <li>
                    Participants must create a MyCity account and report a fault
                    to qualify.
                  </li>
                </ul>

                <h3 className="text-md font-bold mt-6 mb-4">Entry Period:</h3>
                <p className="text-sm">
                  Entries are only valid if submitted between 06:00 and 18:00 on
                  October 25, 2024. Entries outside this time frame will not be
                  accepted.
                </p>

                <h3 className="text-md font-bold mt-6 mb-4">
                  Entry Requirements:
                </h3>
                <ul className="list-disc ml-6 space-y-2 text-sm">
                  <li>
                    Participants must submit a valid ticket number after
                    reporting a fault via MyCity.
                  </li>
                  <li>Only one entry per person is allowed.</li>
                </ul>

                <h3 className="text-md font-bold mt-6 mb-4">
                  Agreement to Rules:
                </h3>
                <p className="text-sm">
                  By entering the competition, participants agree to abide by
                  the official rules and consent to their email address and
                  phone number being used to contact them if they win a prize.
                </p>

                <h3 className="text-md font-bold mt-6 mb-4">Prizes:</h3>
                <ul className="list-disc ml-6 space-y-2 text-sm">
                  <li>Main prize: Pelican™ 1030 Micro Case.</li>
                  <li>
                    Middle prize: One of 12 branded navy blue golf umbrellas
                    from Dormehl Phalane Property Group.
                  </li>
                  <li>
                    Final prize: A MyCity sticker (40x40mm). All participants
                    will receive a MyCity sticker for valid entries.
                  </li>
                </ul>

                <h3 className="text-md font-bold mt-6 mb-4">
                  Winner Selection and Notification:
                </h3>
                <ul className="list-disc ml-6 space-y-2 text-sm">
                  <li>
                    Limited prize winners will be contacted within one week of
                    the end of the giveaway date (October 25, 2024).
                  </li>
                  <li>
                    Non-limited prizes will be awarded upon showing a valid
                    entry to a MyCity team member.
                  </li>
                  <li>
                    Winners must respond within 72 hours of being contacted.
                    Failure to respond within this time may result in forfeiting
                    the prize, and an alternate winner may be selected.
                  </li>
                </ul>

                <h3 className="text-md font-bold mt-6 mb-4">Prize Delivery:</h3>
                <p className="text-sm">
                  Prizes must be claimed as specified in the winner&apos;s
                  notification message. Non-limited prizes can be claimed in
                  person by presenting a valid entry.
                </p>

                <h3 className="text-md font-bold mt-6 mb-4">Use of Data:</h3>
                <p className="text-sm">
                  Participants agree that their personal information (email,
                  phone number) may be used by MyCity solely for the purpose of
                  administering the giveaway.
                </p>

                <h3 className="text-md font-bold mt-6 mb-4">
                  General Conditions:
                </h3>
                <p className="text-sm">
                  MyCity reserves the right to modify, suspend, or terminate the
                  giveaway if circumstances arise outside its control. Any
                  fraudulent activity or violation of the giveaway rules may
                  result in disqualification.
                </p>
              </div>

              {/* Right Column: How to Enter */}
              <div className="bg-gray-700 bg-opacity-70 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  How to Enter
                </h2>
                <div className="flex justify-center items-center">
                  <div className="mb-4 w-full ">
                    <ol className="list-decimal ml-6 space-y-4">
                      <li>Create an account on MyCity.</li>
                      <li>Report a fault using MyCity.</li>
                      <li>Go to this page and enter your ticket number.</li>
                      <li>Provide your contact information.</li>
                    </ol>
                    <p className="my-4 text-center text-blue-300 font-semibold">
                      * One entry per person.
                    </p>
                  </div>
                  <div className="mb-4 w-full flex justify-center items-center">
                    <Image
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/giveaway.webp"
                      alt="Giveaway"
                      width={246}
                      height={246}
                      className="object-fill rounded-md mb-4"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-center">
                  Submit Your Entry
                </h2>
                <form onSubmit={handleSubmit}>
                  {/* Ticket Number */}
                  <div className="mb-4">
                    <label
                      htmlFor="ticketNumber"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Ticket Number
                    </label>
                    <input
                      type="text"
                      id="ticketNumber"
                      name="ticketNumber"
                      value={formData.ticketNumber}
                      onChange={handleChange}
                      required
                      className="w-full p-2 bg-gray-800 text-white rounded-lg"
                    />
                  </div>

                  {/* Name */}
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-2 bg-gray-800 text-white rounded-lg"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-2 bg-gray-800 text-white rounded-lg"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="mb-6">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Your Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full p-2 bg-gray-800 text-white rounded-lg"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-gray-900 font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => setEntry(formData.ticketNumber, formData.name, formData.email, formData.phoneNumber)}
                  >
                    Submit Entry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile View */}
      {/* Mobile View */}
<div className="block sm:hidden">
  <Navbar showLogin={true} />

  {/* Background Image */}
  <div
    style={{
      position: "fixed", // Changed from absolute to fixed to start the background from the top
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage:
        'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      zIndex: -1, // Ensure the background stays behind the content
    }}
  ></div>

  <main className="relative z-10 p-4">
    {/* Smaller MyCity Logo */}
    <div className="text-white text-opacity-80 font-bold flex justify-center mb-2">
      <Image
        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-256.webp"
        alt="MyCity"
        width={120} // Reduced width
        height={120} // Reduced height
      />
    </div>

    {/* Page Title */}
    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 text-center mb-4">
      Giveaway!
    </h1>

    {/* Giveaway Summary (Short version) */}
    <div className="text-white text-opacity-90 space-y-4 mb-4">
      <p className="text-sm">
        Enter the MyCity giveaway for a chance to win amazing prizes like a branded umbrella, a Pelican Micro Case, and a MyCity logo sticker for the first 100 entries.
      </p>
      <ul className="list-disc ml-4 text-sm">
        <li>Main prize: Pelican™ Micro Case (Valued at over R1000)</li>
        <li>12x Branded Golf Umbrellas (Valued at over R200)</li>
        <li>Sticker for first 100 entries</li>
      </ul>
    </div>

    {/* Prize Information */}
    <div className="text-white text-opacity-90 space-y-6">
      {/* Main Prize */}
      <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg">
        <Image
          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/giveaway/Pelican-1030.webp"
          alt="Main Prize"
          width={300}
          height={300}
          className="w-full object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-bold">Pelican™ 1030 Micro Case</h3>
        <h3 className="text-md font-bold mb-3">(1x Valued at over R1000)</h3>
      </div>

      {/* Middle Prize */}
      <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg">
        <Image
          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/giveaway/Umbrella.webp"
          alt="Middle Prize"
          width={300}
          height={300}
          className="w-full object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-bold">DPG Branded Golf Umbrella</h3>
        <h3 className="text-md font-bold mb-3">(12x Valued at over R200)</h3>
      </div>

      {/* Final Prize */}
      <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg">
        <Image
          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/giveaway/Sticker.webp"
          alt="Final Prize"
          width={300}
          height={300}
          className="w-full object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-bold">MyCity Logo Sticker</h3>
        <h3 className="text-md font-bold mb-3">(First 100 entries)</h3>
      </div>
    </div>

    {/* Entry Form Section */}
    <div className="bg-gray-700 bg-opacity-70 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Submit Your Entry</h2>

      <form onSubmit={handleSubmit}>
        {/* Ticket Number */}
        <div className="mb-4">
          <label
            htmlFor="ticketNumber"
            className="block text-sm font-medium text-white mb-2"
          >
            Ticket Number
          </label>
          <input
            type="text"
            id="ticketNumber"
            name="ticketNumber"
            value={formData.ticketNumber}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-800 text-white rounded-lg"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-800 text-white rounded-lg"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white mb-2"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-800 text-white rounded-lg"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-white mb-2"
          >
            Your Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-800 text-white rounded-lg"
          />
        </div>

        {/* Submit Button with Padding */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-gray-900 font-semibold rounded-lg hover:bg-blue-600 transition-colors mb-16" // Added bottom margin for padding
          onClick={() =>
            setEntry(
              formData.ticketNumber,
              formData.name,
              formData.email,
              formData.phoneNumber
            )
          }
        >
          Submit Entry
        </button>
      </form>
    </div>
  </main>
</div>

    </div>
  );
}
