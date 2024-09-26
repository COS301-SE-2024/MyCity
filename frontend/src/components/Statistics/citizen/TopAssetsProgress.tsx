"use client";

import React, { useState } from "react";

interface TopAssetsProgressProps {
  data: any;
}

export default function TopAssetsProgress({ data }: TopAssetsProgressProps) {
  // Safeguard: Check if necessary data properties are available
  if (
    !data ||
    !data.by_asset ||
    !data.by_asset_by_avg_time ||
    !data.by_asset_by_etc_time
  ) {
    return <p>No data available for asset progress</p>;
  }

  // Parse the data strings into JSON objects
  const faultReports = JSON.parse(data.by_asset.replace(/'/g, '"'));
  const avgTimes = JSON.parse(data.by_asset_by_avg_time.replace(/'/g, '"'));
  const estimatedTimes = JSON.parse(
    data.by_asset_by_etc_time.replace(/'/g, '"')
  );

  // Create an array of assets sorted by the difference between avgTime and estimatedTime
  const sortedAssets = Object.entries(faultReports)
    .filter(
      ([asset]) =>
        avgTimes[asset] !== undefined && estimatedTimes[asset] !== undefined
    )
    .sort(([assetA], [assetB]) => {
      const diffA = avgTimes[assetA] - estimatedTimes[assetA];
      const diffB = avgTimes[assetB] - estimatedTimes[assetB];
      return diffA - diffB; // Sort from best to worst (smallest difference to largest)
    });

  // Pagination settings
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedAssets.length / itemsPerPage);

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

  // Get current page's assets
  const paginatedAssets = sortedAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-lg p-2 shadow-lg h-[38vh] w-full overflow-hidden">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Asset Resolution Times
      </h2>
      <div className="space-y-2 h-[75%]">
        {paginatedAssets.map(([asset]) => {
          const avgTime = avgTimes[asset];
          const estimatedTime = estimatedTimes[asset];
          const avgTimePercentage =
            (avgTime / Math.max(avgTime, estimatedTime)) * 100;
          const estimatedTimePercentage =
            (estimatedTime / Math.max(avgTime, estimatedTime)) * 100;
          const avgTimeBarColor =
            avgTime < estimatedTime
              ? "rgba(144, 238, 144, 0.6)" // Green if avgTime is less than estimatedTime
              : avgTime === estimatedTime
              ? "rgba(173, 216, 230, 0.6)" // Light blue if avgTime is equal to estimatedTime
              : "rgba(255, 99, 132, 0.6)"; // Red if avgTime is greater than estimatedTime

          return (
            <div key={asset} className="">
              <p className="text-black font-semibold">{asset}</p>

              {/* Average Time Bar with Time Display */}
              <div className="w-full bg-gray-200 rounded-full h-6 mb-2 relative">
                <div
                  className="h-6 rounded-full"
                  style={{
                    width: `${avgTimePercentage}%`,
                    backgroundColor: avgTimeBarColor,
                  }}
                ></div>
                <span className="absolute left-2 top-0 text-xs font-bold h-full flex items-center">
                  Actual: {avgTime} hours
                </span>
              </div>

              {/* Estimated Time Bar with Time Display */}
              <div className="w-full bg-gray-200 rounded-full h-6 relative">
                <div
                  className="h-6 rounded-full"
                  style={{
                    width: `${estimatedTimePercentage}%`,
                    backgroundColor: "rgba(173, 216, 230, 0.6)",
                  }}
                ></div>
                <span className="absolute left-2 top-0 text-xs font-bold h-full flex items-center">
                  Estimated: {estimatedTime} hours
                </span>
              </div>
            </div>
          );
        })}
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
