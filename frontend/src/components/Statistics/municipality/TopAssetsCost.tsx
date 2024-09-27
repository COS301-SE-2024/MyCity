"use client";

import React, { useState } from "react";

interface TopAssetsProgressProps {
  data: any;
}

export default function TopAssetsProgress({ data }: TopAssetsProgressProps) {
  // Pagination settings
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1); // Always initialize hooks

  // Safeguard: Check if necessary data properties are available
  if (
    !data ||
    !data.by_asset ||
    !data.by_asset_by_avg_cost ||
    !data.by_asset_by_etc_cost
  ) {
    return <p>No data available for asset progress</p>;
  }

  // Parse the data strings into JSON objects
  const faultReports = JSON.parse(data.by_asset.replace(/'/g, '"'));
  const avgCosts = JSON.parse(data.by_asset_by_avg_cost.replace(/'/g, '"'));
  const estimatedCosts = JSON.parse(
    data.by_asset_by_etc_cost.replace(/'/g, '"')
  );

  // Create an array of assets sorted by the difference between avgCost and estimatedCost
  const sortedAssets = Object.entries(faultReports)
    .filter(
      ([asset]) =>
        avgCosts[asset] !== undefined && estimatedCosts[asset] !== undefined
    )
    .sort(([assetA], [assetB]) => {
      const diffA = avgCosts[assetA] - estimatedCosts[assetA];
      const diffB = avgCosts[assetB] - estimatedCosts[assetB];
      return diffA - diffB; // Sort from best to worst (smallest difference to largest)
    });

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
    <div className="bg-white bg-opacity-80 rounded-lg p-2 shadow-lg h-[38vh] w-full overflow-hidden">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Asset Resolution Costs
      </h2>
      <div className="space-y-2 h-[75%]">
        {paginatedAssets.map(([asset]) => {
          const avgCost = avgCosts[asset];
          const estimatedCost = estimatedCosts[asset];
          const avgCostPercentage =
            (avgCost / Math.max(avgCost, estimatedCost)) * 100;
          const estimatedCostPercentage =
            (estimatedCost / Math.max(avgCost, estimatedCost)) * 100;
          const avgCostBarColor =
            avgCost < estimatedCost
              ? "rgba(144, 238, 144, 0.6)" // Green if avgCost is less than estimatedCost
              : avgCost === estimatedCost
              ? "rgba(173, 216, 230, 0.6)" // Light blue if avgCost is equal to estimatedCost
              : "rgba(255, 99, 132, 0.6)"; // Red if avgCost is greater than estimatedCost

          return (
            <div key={asset} className="">
              <p className="text-black font-semibold">{asset}</p>

              {/* Average Cost Bar with Cost Display */}
              <div className="w-full bg-gray-200 rounded-full h-6 mb-2 relative">
                <div
                  className="h-6 rounded-full"
                  style={{
                    width: `${avgCostPercentage}%`,
                    backgroundColor: avgCostBarColor,
                  }}
                ></div>
                <span className="absolute left-2 top-0 text-xs font-bold h-full flex items-center">
                  Actual: R{avgCost}
                </span>
              </div>

              {/* Estimated Cost Bar with Cost Display */}
              <div className="w-full bg-gray-200 rounded-full h-6 relative">
                <div
                  className="h-6 rounded-full"
                  style={{
                    width: `${estimatedCostPercentage}%`,
                    backgroundColor: "rgba(173, 216, 230, 0.6)",
                  }}
                ></div>
                <span className="absolute left-2 top-0 text-xs font-bold h-full flex items-center">
                  Estimated: R{estimatedCost}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between my-2 w-full">
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
}
