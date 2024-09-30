"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import FaultCategoryPieChart from "@/components/Statistics/service-provider/FaultCategoryPieChart";
import ReportsOverTimeBarChart from "@/components/Statistics/service-provider/ReportsOverTimeBarChart";
import FaultStatesDoughnutChart from "@/components/Statistics/service-provider/FaultStatesDoughnutChart";
import TopAssetsProgress from "@/components/Statistics/service-provider/TopAssetsProgress";
import TopAssetsCost from "@/components/Statistics/service-provider/TopAssetsCost";
import MunicipalityRank from "@/components/Statistics/service-provider/MunicipalityRank";
import ServiceProvidersGrid from "@/components/Statistics/service-provider/ServiceProvidersGrid";
import AssetExpense from "@/components/Statistics/service-provider/AssetExpense";
import ServiceProvidersTicketsInfo from "@/components/Statistics/service-provider/ServiceProvidersTicketsInfo";
import InhouseVsExternalPieChart from "@/components/Statistics/service-provider/InhouseVsExternalPieChart";
import {
  getTicketsPerMunicipality,
  getContractsPerServiceProvider,
} from "@/services/analytics.service";
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
import { user } from "@nextui-org/react";

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

export default function ServiceProviderStatisticsPage() {
  const userProfile = useProfile();
  const [selectedServiceProvider, setSelectedServiceProvider] =
    useState<string>(""); // Start with empty state
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultServiceProviderSet, setDefaultServiceProviderSet] =
    useState(false); // New flag for setting default municipality once
  // const [serviceProviders, setServiceProviders] = useState<string[]>([]); // State to store service providers

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_data = await userProfile.getUserProfile();
        const userSession = user_data.current?.session_token;
        const serviceprovider = user_data.current?.company_name;
        // Set the default municipality only if it hasn't been set yet
        if (serviceprovider && !defaultServiceProviderSet) {
          console.log("Setting default service provider:", serviceprovider);
          setSelectedServiceProvider(serviceprovider); // Set the default municipality to the user's
          setDefaultServiceProviderSet(true); // Mark default municipality as set
        }

        // Fetch data only if we have a selected municipality
        if (userSession && selectedServiceProvider) {
          console.log(
            "Fetching data for service provider:",
            selectedServiceProvider
          );
          const result = await getContractsPerServiceProvider(
            selectedServiceProvider,
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
  }, [selectedServiceProvider, userProfile]); // Fetch data only when selectedMunicipality or userProfile changes

  if (loading) {
    return (
      <div>
        <div className="h-screen w-screen overflow-auto">
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
      </div>
    );
  }

  // Calculate external contracts
  const { by_asset, by_asset_by_avg_cost } = data || {};

  console.log("Data small:", data);

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
              Statistics Dashboard
            </h1>
          </div>
        </div>

        <div className="w-[80%] h-[80vh] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {data && (
              <div className="w-full flex gap-4">
                {/* ==== Municipality Tickets Info ==== */}
                <div className="flex w-1/2">
                  <ServiceProvidersTicketsInfo
                    serviceProvider={data.service_provider}
                    contracts={data.contracts}
                  />
                </div>

                <div className="flex w-1/2">
                  <FaultStatesDoughnutChart data={data.by_state} />
                </div>
              </div>
            )}

            {data && (
              <div className="w-full flex gap-4">
                <ServiceProvidersGrid serviceProviders={data.by_municipality} />
              </div>
            )}

            {data && (
              <div className="w-full flex gap-4">
                <AssetExpense
                  data={{
                    by_asset: by_asset || null,
                    by_asset_by_avg_cost: by_asset_by_avg_cost || null,
                  }}
                />
              </div>
            )}

            {data && (
              <div className="w-full flex gap-4">
                {/* === Asset Resolution Time === */}
                <div className="w-1/2">
                  <TopAssetsCost data={data} />
                </div>

                {/* === Top Assets Resolution Cost === */}
                <div className="w-1/2">
                  <TopAssetsProgress data={data} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
