"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import MunicipalitySelector from "@/components/Statistics/citizen/MunicipalitySelector";
import FaultCategoryPieChart from "@/components/Statistics/citizen/FaultCategoryPieChart";
import ReportsOverTimeBarChart from "@/components/Statistics/citizen/ReportsOverTimeBarChart";
import FaultStatesDoughnutChart from "@/components/Statistics/citizen/FaultStatesDoughnutChart";
import TopAssetsProgress from "@/components/Statistics/citizen/TopAssetsProgress";
import MunicipalityRank from "@/components/Statistics/citizen/MunicipalityRank";
import MunicipalityTicketsInfo from "@/components/Statistics/citizen/MunicipalityTicketsInfo";
import { getTicketsPerMunicipality } from "@/services/analytics.service";
import { useProfile } from "@/hooks/useProfile";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function StatisticsPage() {
  const userProfile = useProfile();
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>(""); // Start with empty state
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultMunicipalitySet, setDefaultMunicipalitySet] = useState(false); // New flag for setting default municipality once

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_data = await userProfile.getUserProfile();
        const userSession = user_data.current?.session_token;
        const userMunicipality = user_data.current?.municipality; // Fetch user's municipality

        // Set the default municipality only if it hasn't been set yet
        if (userMunicipality && !defaultMunicipalitySet) {
          setSelectedMunicipality(userMunicipality); // Set the default municipality to the user's
          setDefaultMunicipalitySet(true); // Mark default municipality as set
        }

        // Fetch data only if we have a selected municipality
        if (userSession && selectedMunicipality) {
          const result = await getTicketsPerMunicipality(
            selectedMunicipality,
            userSession
          );
          setData(result[0]); // Assuming result is an array and we need the first element
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMunicipality, userProfile]); // Fetch data only when selectedMunicipality or userProfile changes

  if (loading) {
    return (
      <div>
        <div className="h-screen w-screen overflow-hidden">
          <Navbar />
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
        </div>
        ;
      </div>
    );
  }

  // Safely check if `data` exists before rendering the charts
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Navbar />

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

      <main className="flex flex-col justify-center items-center">
        <div className="flex justify-between w-[80%] mb-4">
          <div className="w-[50%]">
            <h1 className="text-4xl font-bold text-white text-opacity-80 w-full">
              Statistics
            </h1>
          </div>
          <div className="w-[50%]">
            <MunicipalitySelector
              selectedMunicipality={selectedMunicipality}
              setSelectedMunicipality={setSelectedMunicipality}
            />
          </div>
        </div>

        <div className="w-[80%] h-[80vh] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="flex gap-4">
              {data && (
                <>
                  <MunicipalityTicketsInfo
                    municipalityName={data.municipality_id}
                    totalTickets={data.tickets}
                    citizens={data.citizens}
                  />
                  <MunicipalityRank
                    rank={data.rank}
                    stateRank={data.state_rank}
                    costRank={data.cost_rank}
                    timeRank={data.time_rank}
                  />
                </>
              )}
            </div>
            {data?.by_date && <ReportsOverTimeBarChart data={data.by_date} />}
            {data?.by_asset && <FaultCategoryPieChart data={data.by_asset} />}
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                {data?.by_state && (
                  <FaultStatesDoughnutChart data={data.by_state} />
                )}
              </div>
              <div className="w-1/2">
                <TopAssetsProgress data={data} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
