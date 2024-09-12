"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaSpinner,
} from "react-icons/fa";
import {
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

import { getMunicipalityList } from "@/services/municipalities.service";
import { BasicMunicipality } from "@/types/custom.types";

export default function About() {
  const [municipalities, setMunicipalities] = useState<BasicMunicipality[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const data = await getMunicipalityList();
        setMunicipalities(data);
      } catch (error: any) {
        console.error("Error fetching municipalities:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchMunicipalities();
  }, []);

  const barData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Data for the pie chart
  const pieData = {
    labels: [
      "Open",
      "Taking Tenders",
      "Assigning Contracts",
      "In Progress",
      "Completed",
    ],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "rgb(191, 219, 254)",
          "rgb(167, 243, 208)",
          "rgb(254, 240, 138)",
          "rgb(254, 202, 202)",
          "rgb(233, 213, 255)",
        ],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "right", // Move legend to the right side
        labels: {
          boxWidth: 20,
          padding: 20,
        },
      },
    },
  };

  function formatMunicipalityID(mun: string): string {
    if (typeof mun !== "string") {
      return ""; // Or some other default value
    }
    return mun.replace(/ /g, "_");
  }

  return (
    <div className="h-screen w-screen">
      {/* Desktop View */}
      <div className="hidden sm:block h-full w-full">
        {/* Navbar */}
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
            backgroundAttachment: "fixed",
            zIndex: -1,
          }}
        ></div>
        <main className="h-full">

        </main>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <Navbar />
        {/* Mobile content */}
        <MobileView />
      </div>
    </div>
  );
}

// Reusable Chart Container
function ChartContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex border flex-col justify-center items-center">
      <div>
        <h3>{title}</h3>
      </div>
      <div className="w-[95%] h-[90%] overflow-hidden items-center border">
        {children}
      </div>
    </div>
  );
}

// Mobile View
function MobileView() {
  return (
    <div className="h-screen flex items-center justify-center text-center bg-gray-800 text-white">
      <div>
        <h1 className="text-4xl">Mobile View Coming Soon</h1>
        <p className="text-xl mt-4">
          Please use the desktop version for the full experience.
        </p>
      </div>
    </div>
  );
}
