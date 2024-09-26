"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

interface FaultCategoryBarChartProps {
  data: string;
}

export default function FaultCategoryBarChart({
  data,
}: FaultCategoryBarChartProps) {
  const faultReports = JSON.parse(data.replace(/'/g, '"'));

  // Convert faultReports to an array of entries for easy pagination
  const faultReportsArray = Object.entries(faultReports);

  // Pagination settings
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(faultReportsArray.length / itemsPerPage);

  // Get current page's assets
  const paginatedAssets = faultReportsArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Prepare data for bar chart
  const barChartData = {
    labels: paginatedAssets.map(([asset]) => asset),
    datasets: [
      {
        label: "Fault Reports by Category",
        data: paginatedAssets.map(([, count]) => count),
        backgroundColor: [
          "rgba(173, 216, 230, 0.6)",
          "rgba(255, 218, 185, 0.6)",
          "rgba(144, 238, 144, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(128, 0, 128, 0.6)",
          "rgba(255, 182, 193, 0.6)",
          "rgba(255, 255, 102, 0.6)",
          "rgba(221, 160, 221, 0.6)",
        ],
      },
    ],
  };

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

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg h-[38vh] overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Fault Reports by Category
      </h2>
      <div className="h-[70%]">
        <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between my-2 w-full">
        <button
          className="bg-gray-300 py-2 w-1/4 rounded-full disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="bg-gray-300 py-2 w-1/4 rounded-full disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
