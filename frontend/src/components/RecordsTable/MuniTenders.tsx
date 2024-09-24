import React, { useState } from "react";
import { ChevronUp } from "lucide-react";

export default function MuniTenders({
  tenders,
  onBack,
}: {
  tenders: any | null;
  onBack: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 10;


  const tendersToDisplay = tenders; //|| mockTenders; // Use mock data if tenders is null

  if (!tendersToDisplay || tendersToDisplay.length === 0) {
    return (
      <div
        className="overflow-x-auto bg-white bg-opacity-80 text-black rounded-b-3xl mt-[-16px] ml-7 mr-7 mb-4 relative z-0"
        style={{
          boxShadow:
            "0px -10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="min-w-full rounded-t-lg relative">
          <button
            onClick={onBack}
            className="absolute top-2 left-2 text-sm font-bold text-gray-700 underline hover:scale-110 transition-transform duration-200"
          >
            <ChevronUp size={20} />
          </button>
          <div className="text-center py-16">This ticket has no bids yet.</div>
        </div>
      </div>
    );
  }

  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTenders = tendersToDisplay.slice(
    indexOfFirstTender,
    indexOfLastTender
  );
  const totalPages = Math.ceil(tendersToDisplay.length / tendersPerPage);

  return (
    <div>
      {/* Desktop View */}
      <div
        className="overflow-x-auto bg-white bg-opacity-80 text-black rounded-b-3xl mt-[-16px] ml-7 mr-7 mb-4 relative z-0 hidden sm:block"
        style={{
          boxShadow:
            "0px -10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="min-w-full rounded-3xl relative">
          <button
            onClick={onBack}
            className="absolute top-2 left-2 text-sm font-bold text-gray-700 hover:scale-110 transition-transform duration-200"
          >
            <ChevronUp size={20} />
          </button>
          <div className="text-lg font-bold text-center mt-2 mb-2">
            Bids for this Ticket:
          </div>
          <>
            <div className="grid grid-cols-6 gap-4 items-center px-2 py-1 font-bold text-center border-b border-gray-200">
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Tender ID</div>
              <div className="col-span-1">Service Provider</div>
              <div className="col-span-1">Issue Date</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Estimated Duration</div>
            </div>
            <div className="min-w-full">
              {currentTenders.map((tender: any) => (
                <div
                  key={tender.ticket_id}
                  className="grid grid-cols-6 gap-4 items-center px-2 py-1 text-center border-b border-gray-100"
                >
                  <div className="col-span-1">{tender.status}</div>
                  <div className="col-span-1">{tender.tendernumber}</div>
                  <div className="col-span-1">{tender.companyname}</div>
                  <div className="col-span-1">{tender.issue_date}</div>
                  <div className="col-span-1">{tender.quote}</div>
                  <div className="col-span-1">{tender.estimated_duration}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-48 py-2 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-48 py-2 ${
                  currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden bg-white bg-opacity-80 text-black rounded-b-3xl mt-[-16px] ml-4 mr-4 mb-4 relative z-0">
        <div className="relative">
          <button
            onClick={onBack}
            className="absolute top-2 left-2 text-sm font-bold text-gray-700 hover:scale-110 transition-transform duration-200"
          >
            <ChevronUp size={20} />
          </button>
          <div className="text-lg font-bold text-center mt-2 mb-4">
            Bids for this Ticket:
          </div>

          {/* Mobile-friendly layout */}
          {currentTenders.map((tender: any) => (
            <div
              key={tender.ticket_id}
              className="mb-4 px-4 py-2 bg-gray-100 rounded-b-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Status:</span>
                <span className="text-sm">{tender.status}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Tender ID:</span>
                <span className="text-sm">{tender.tendernumber}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Service Provider:</span>
                <span className="text-sm">{tender.companyname}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Issue Date:</span>
                <span className="text-sm">{tender.issue_date}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Price:</span>
                <span className="text-sm">{tender.price}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Duration:</span>
                <span className="text-sm">{tender.estimated_duration}</span>
              </div>
            </div>
          ))}

          {/* Pagination for mobile */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-4 py-2 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-4 py-2 ${
                currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
