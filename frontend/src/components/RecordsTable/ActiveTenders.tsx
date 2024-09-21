import React, { useState, useEffect } from "react";
import Tender from "../Tenders/MuniTenderMini"; // Update the import path if necessary
import { FaInfoCircle, FaTimes } from "react-icons/fa";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  tender_id: string;
  tendernumber: string;
  company_id: string;
  companyname: string;
  datetimesubmitted: string;
  ticket_id: string;
  ticketnumber: string;
  status: Status;
  quote: number;
  estimatedTimeHours: number;
  longitude: string;
  latitude: string;
  upload: File | null;
  hasReportedCompletion: boolean;
}

// Mock Data
const mockTenders: TenderType[] = [
  {
    tender_id: "1",
    tendernumber: "TN001",
    company_id: "C001",
    companyname: "ACME Corp",
    datetimesubmitted: "2024-01-12",
    ticket_id: "T001",
    ticketnumber: "TK001",
    status: "Active",
    quote: 1000,
    estimatedTimeHours: 48,
    longitude: "34.0522",
    latitude: "-118.2437",
    upload: null,
    hasReportedCompletion: false,
  },
  {
    tender_id: "2",
    tendernumber: "TN002",
    company_id: "C002",
    companyname: "Global Solutions",
    datetimesubmitted: "2024-01-15",
    ticket_id: "T002",
    ticketnumber: "TK002",
    status: "Rejected",
    quote: 1500,
    estimatedTimeHours: 72,
    longitude: "40.7128",
    latitude: "-74.0060",
    upload: null,
    hasReportedCompletion: false,
  },
  {
    tender_id: "3",
    tendernumber: "TN003",
    company_id: "C003",
    companyname: "Tech Innovations",
    datetimesubmitted: "2024-01-18",
    ticket_id: "T003",
    ticketnumber: "TK003",
    status: "Closed",
    quote: 2000,
    estimatedTimeHours: 96,
    longitude: "51.5074",
    latitude: "-0.1278",
    upload: null,
    hasReportedCompletion: true,
  },
];

export default function ActiveTenders({ tenders = mockTenders, refresh }: { tenders?: TenderType[]; refresh: () => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 10;

  // Ensure tenders is an array
  const safeTenders = tenders || [];

  // Log the data to confirm it's being loaded
  useEffect(() => {
    console.log("Tenders: ", safeTenders);
  }, [safeTenders]);

  // Calculate pagination details
  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTenders = safeTenders.slice(indexOfFirstTender, indexOfLastTender);
  const totalPages = Math.ceil(safeTenders.length / tendersPerPage);

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

  const handleClose = (data: number) => {
    refresh();
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto bg-transparent rounded-lg shadow-md">
        <div className="min-w-full text-white text-opacity-80 rounded-t-lg relative">
          <div className="text-xl font-bold text-center">
            Click on a Tender to view more details.
          </div>
          <div className="grid grid-cols-6 gap-4 items-center mb-2 mt-6 px-2 py-1 font-bold text-center border-b border-gray-200">
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Tender ID</div>
            <div className="col-span-1">Service Provider</div>
            <div className="col-span-1">Issue Date</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Estimated Duration</div>
          </div>
          <div className="min-w-full">
            {currentTenders.length > 0 ? (
              currentTenders.map((tender) => (
                <Tender key={tender.tender_id} onClose={handleClose} tender={tender} />
              ))
            ) : (
              <div className="mt-16 text-white text-opacity-80 text-center">No Active Tenders to display.</div>
            )}
          </div>

          {currentTenders.length > 0 && (
            <div className="flex justify-between mt-4 text-white">
              <button
                onClick={handlePrevPage}
                className={`px-48 py-2 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                className={`px-48 py-2 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="text-xl font-bold text-white text-opacity-80 text-center mb-4">Click on a Tender to view more details.</div>
        <div className="min-w-full">
          {currentTenders.length > 0 ? (
            currentTenders.map((tender) => (
              <Tender key={tender.tender_id} onClose={handleClose} tender={tender} />
            ))
          ) : (
            <div className="mt-16 text-white text-opacity-80 text-center">No Active Tenders to display.</div>
          )}
        </div>

        {currentTenders.length > 0 && (
          <div className="flex justify-between mt-4 text-white">
            <button
              onClick={handlePrevPage}
              className={`px-48 py-2 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              className={`px-48 py-2 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
