import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AssetExpenseProps {
  data: {
    by_asset: string | null; // Compressed JSON (string)
    by_asset_by_avg_cost: string | null; // Compressed JSON (string)
  } | null;
}

const AssetExpense: React.FC<AssetExpenseProps> = ({ data }) => {
  const [assetExpenses, setAssetExpenses] = useState<{ [key: string]: number }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const assetsPerPage = 8;

  useEffect(() => {
    if (data && data.by_asset && data.by_asset_by_avg_cost) {
      try {
        // Fix the JSON string format by replacing single quotes with double quotes
        const sanitizedByAsset = data.by_asset.replace(/'/g, '"');
        const sanitizedByAssetAvgCost = data.by_asset_by_avg_cost.replace(
          /'/g,
          '"'
        );

        // Parse the fixed JSON strings
        const parsedByAsset = JSON.parse(sanitizedByAsset);
        const parsedByAssetAvgCost = JSON.parse(sanitizedByAssetAvgCost);

        // Normalize keys (lowercase, trimmed)
        const normalizeKey = (key: string) => key.toLowerCase().trim();

        const normalizedByAsset = Object.keys(parsedByAsset).reduce(
          (acc, key) => {
            acc[normalizeKey(key)] = parsedByAsset[key];
            return acc;
          },
          {} as { [key: string]: number }
        );

        const normalizedByAssetAvgCost = Object.keys(
          parsedByAssetAvgCost
        ).reduce((acc, key) => {
          acc[normalizeKey(key)] = parsedByAssetAvgCost[key];
          return acc;
        }, {} as { [key: string]: number });

        // Calculate total expense for each asset type and filter out assets with 0 total expense
        const assetExpenses = Object.keys(normalizedByAsset).reduce(
          (acc, assetType) => {
            const assetCount = normalizedByAsset[assetType] || 0;
            const avgCost = normalizedByAssetAvgCost[assetType] || 0;
            const totalExpense = Math.round(assetCount * avgCost); // Round the total expense

            // Only include assets with total expense > 0
            if (totalExpense > 0) {
              acc[assetType] = totalExpense;
            }

            return acc;
          },
          {} as { [key: string]: number }
        );

        setAssetExpenses(assetExpenses);
      } catch (error) {
        console.error("Error parsing compressed JSON:", error);
      }
    }
  }, [data]);

  // Convert the assetExpenses object into an array and sort it by total expense in descending order
  const sortedAssetEntries = Object.entries(assetExpenses).sort(
    (a, b) => b[1] - a[1]
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedAssetEntries.length / assetsPerPage);
  const displayedAssets = sortedAssetEntries.slice(
    (currentPage - 1) * assetsPerPage,
    currentPage * assetsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Data for the bar chart
  const chartData = {
    labels: displayedAssets.map(([assetType]) => assetType),
    datasets: [
      {
        label: "Total Expense in Rands",
        data: displayedAssets.map(([, totalExpense]) => totalExpense),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Total Expense by Fault Type (Last 6 months)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Remove decimal points from the y-axis labels
        },
      },
    },
  };

  if (!data || !data.by_asset || !data.by_asset_by_avg_cost) {
    return <div></div>; // You can replace this with any loader or message
  }
  return (
    <div className="bg-white bg-opacity-90 flex flex-col bg-opacity-80 text-center items-center justify-center w-full h-[38vh] rounded-lg p-4 shadow-lg">
      <h2 className="text-2xl w-full font-bold mb-2">
        Total Expense by Fault Type
      </h2>
      <div className="mb-2 h-[75%] w-full justify-center items-center flex ">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between mb-4 w-full">
        <button
          className="bg-gray-600 text-white font-bold py-2 w-1/4 rounded-full disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-lg font-bold ">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="bg-blue-300 font-bold py-2 w-1/4 rounded-full disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AssetExpense;
