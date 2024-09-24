import React, { useState } from "react";
import Tender from "../Tenders/MuniTenderMini"; // Update the import path if necessary
import { ChevronUp } from "lucide-react";

type TenderStatus = "under_review" | "rejected" | "submitted" | "approved";

interface TenderType {
  tender_id: string;
  tendernumber: string;
  company_id: string;
  companyname: string;
  serviceProvider: string; // Add serviceProvider here
  datetimesubmitted: string;
  ticketnumber: string;
  ticket_id: string;
  status: TenderStatus;
  quote: number;
  longitude: string;
  latitude: string;
  estimatedTimeHours: number;
  upload: File | null;
  hasReportedCompletion: boolean; // New prop
}

interface TenderTypeProps {
  tenders: TenderType[];
}

export default function MuniTenders({
  tenders,
  onBack,
}: {
  tenders: TenderType[];
  onBack: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 10;

  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTenders = tenders.slice(indexOfFirstTender, indexOfLastTender);
  const totalPages = Math.ceil(tenders.length / tendersPerPage);

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
    <div>
      {/* Desktop View */}
      <div
        className="overflow-x-auto bg-white bg-opacity-80 text-black rounded-b-3xl mt-[-16px] ml-7 mr-7 mb-4 relative z-20 sm:block"
        style={{
          boxShadow:
            "0px -10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="min-w-full rounded-3xl relative z-30">
          <button
            onClick={onBack}
            className="absolute top-2 left-2 text-sm font-bold text-gray-700 hover:scale-110 transition-transform duration-200 z-50"
          >
            <ChevronUp size={20} />
          </button>
          <div className="text-lg font-bold text-center mt-2 mb-2">
            Bids for this Ticket:
          </div>
          {currentTenders.length > 0 ? (
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
                {currentTenders.map((tender) => (
                  <Tender key={tender.ticket_id} tender={tender} onClose={onBack} />
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePrevPage}
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
                  onClick={handleNextPage}
                  className={`px-48 py-2 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">This ticket has no bids yet.</div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden bg-white bg-opacity-80 text-black rounded-b-3xl mt-[-16px] ml-4 mr-4 mb-4 relative z-20">
        <div className="relative z-30">
          <button
            onClick={onBack}
            className="absolute top-2 left-2 text-sm font-bold text-gray-700 hover:scale-110 transition-transform duration-200 z-50"
          >
            <ChevronUp size={20} />
          </button>
          <div className="text-lg font-bold text-center mt-2 mb-4">
            Bids for this Ticket:
          </div>

          {currentTenders.length > 0 ? (
            <>
              {currentTenders.map((tender) => (
                <div
                  key={tender.ticket_id}
                  className="mb-4 px-4 py-2 bg-gray-100 rounded-b-lg shadow-sm z-40"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Status:</span>
                    <span className="text-sm">{tender.status || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Tender ID:</span>
                    <span className="text-sm">{tender.tender_id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Service Provider:</span>
                    <span className="text-sm">{tender.serviceProvider || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Issue Date:</span>
                    <span className="text-sm">{tender.datetimesubmitted || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Price:</span>
                    <span className="text-sm">{tender.quote || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Duration:</span>
                    <span className="text-sm">{tender.estimatedTimeHours || "N/A"}</span>
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePrevPage}
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
                  onClick={handleNextPage}
                  className={`px-4 py-2 ${
                    currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">This ticket has no bids yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
