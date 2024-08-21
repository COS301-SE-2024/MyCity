import React, { useState } from "react";
import Tender from "../Tenders/MuniTenderMini"; // Update the import path if necessary
import { FaInfoCircle, FaTimes } from "react-icons/fa";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  id: string;
  tender_id: string;
  tendernumber: string;
  ticketnumber: string; // Added this property
  company_id: string;
  companyname: string;
  serviceProvider: string;
  datetimesubmitted: string;
  ticket_id: string;
  status: Status;
  quote: number;
  latitude: string;
  longitude: string;
  estimatedTimeHours: number;
  upload: File | null;
  hasReportedCompletion: boolean;
}

const tenders: TenderType[] = [
  {
    tender_id: "jajansaossaa",
    id: "T001",
    tendernumber: "TN001",
    ticketnumber: "TN1001", // Added this property
    company_id: "C001",
    companyname: "Service Provider A",
    serviceProvider: "Service Provider A",
    datetimesubmitted: "2023-07-01T08:30:00Z",
    ticket_id: "SA0300",
    status: "Active",
    quote: 1500.5,
    estimatedTimeHours: 120, // 5 days
    upload: null,
    hasReportedCompletion: false,
    longitude: "23.44",
    latitude: "23.55",
  },
  {
    id: "T002",
    tender_id: "jajansaossaa",
    tendernumber: "TN002",
    ticketnumber: "TN1002", // Added this property
    company_id: "C002",
    companyname: "Service Provider B",
    serviceProvider: "Service Provider A",
    datetimesubmitted: "2023-07-02T09:15:00Z",
    ticket_id: "SA0302",
    status: "Active",
    quote: 2000.0,
    estimatedTimeHours: 72, // 3 days
    upload: null,
    hasReportedCompletion: false,
    longitude: "23.44",
    latitude: "23.55",
  },
  {
    id: "T003",
    tender_id: "jajansaossaa",
    tendernumber: "TN003",
    ticketnumber: "TN1003", // Added this property
    company_id: "C003",
    companyname: "Service Provider C",
    serviceProvider: "Service Provider A",
    datetimesubmitted: "2023-07-03T10:45:00Z",
    ticket_id: "SA0304",
    status: "Active",
    quote: 2500.75,
    estimatedTimeHours: 96, // 4 days
    upload: null,
    hasReportedCompletion: false,
    longitude: "23.44",
    latitude: "23.55",
  },
  // ...other mock data
];

const statusStyles = {
  Unassigned: "text-blue-500 border-blue-500 rounded-full",
  Active: "text-black bg-green-200 rounded-full",
  Rejected: "text-black bg-red-200 rounded-full",
  Closed: "text-black bg-gray-200 rounded-full",
};

export default function ActiveTenders() {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 10;
  const [selectedTender, setSelectedTender] = useState<TenderType | null>(null);

  // Calculate pagination details
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

  const handleTenderClick = (tender: TenderType) => {
    setSelectedTender(tender);
  };

  const handleTenderClose = () => {
    setSelectedTender(null);
  };

  return (
    <div className="overflow-x-auto bg-transparent rounded-lg shadow-md">
      <div className="min-w-full text-white text-opacity-80 rounded-t-lg text-black relative">
        <div className="grid grid-cols-6 gap-4 items-center px-6 py-1 font-bold text-center border-b border-gray-200">
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Tender ID</div>
         
          <div className="col-span-1">Service Provider</div>
          <div className="col-span-1">Issue Date</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1">Estimated Duration</div>
        </div>
        <div className="min-w-full px-6 py-1">
          {currentTenders.length > 0 ? (
            currentTenders.map((tender) => (
              <div key={tender.id} onClick={() => handleTenderClick(tender)}>
                <Tender tender={tender} onClose={handleTenderClose} />
              </div>
            ))
          ) : (
            <div className="text-white text-opacity-80 mt-16 text-xl text-center">
              No Active Tenders to display.
            </div>
          )}
        </div>

        {currentTenders.length > 0 && (
          <div className="flex justify-between mt-4 text-white">
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
        )}
      </div>
    </div>
  );
}
