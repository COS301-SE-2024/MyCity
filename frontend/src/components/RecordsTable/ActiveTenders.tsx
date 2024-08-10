import React, { useState } from "react";
import Tender from "../Tenders/MuniTenderMini"; // Update the import path if necessary
import { FaInfoCircle, FaTimes } from "react-icons/fa";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  id: string;
  tender_id : string;
  tendernumber: string;
  company_id: string;
  companyname: string;
  serviceProvider: string; //i know its redundant but its the quickest way to fix it without restructuring MANY files or breaking stuff.
  datetimesubmitted: string;
  ticket_id: string;
  status: Status;
  quote: number;
  latitude : string;
  longitude : string;
  estimatedTimeHours: number;
  upload: File | null;
  hasReportedCompletion: boolean;

}

const tenders: TenderType[] = [
  {
    tender_id : "jajansaossaa",
    id: "T001",
    tendernumber: "TN001",
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
    latitude : "23.55"
  },
  {
    id: "T002",
    tender_id : "jajansaossaa",
    tendernumber: "TN002",
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
    latitude : "23.55"
  },
  {
    id: "T003",
    tender_id : "jajansaossaa",
    tendernumber: "TN003",
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
    latitude : "23.55"
  },
  {
    id: "T004",
    tender_id : "jajansaossaa",
    tendernumber: "TN004",
    company_id: "C004",
    companyname: "Service Provider D",
    serviceProvider: "Service Provider A",
    datetimesubmitted: "2023-07-04T11:30:00Z",
    ticket_id: "SA0306",
    status: "Active",
    quote: 1800.0,
    estimatedTimeHours: 48, // 2 days
    upload: null,
    hasReportedCompletion: true,
    longitude: "23.44",
    latitude : "23.55"
  },
  {
    id: "T005",
    tender_id : "jajansaossaa",
    tendernumber: "TN005",
    company_id: "C005",
    companyname: "Service Provider E",
    serviceProvider: "Service Provider A",
    datetimesubmitted: "2023-07-05T12:00:00Z",
    ticket_id: "SA0310",
    status: "Active",
    quote: 2200.0,
    estimatedTimeHours: 72, // 3 days
    upload: null,
    hasReportedCompletion: false,
    longitude: "23.44",
    latitude : "23.55"
  },
  // ...other mock data
];

const statusStyles = {
  'Unassigned': 'text-blue-500 border-blue-500 rounded-full',
  'Active': 'text-black bg-green-200 rounded-full',
  'Rejected': 'text-black bg-red-200 rounded-full',
  'Closed': 'text-black bg-gray-200 rounded-full',
};

const TenderMax = ({ tender, onClose }: { tender: TenderType, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row">
        <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
          <FaTimes size={24} />
        </button>
        <div className="flex flex-col lg:flex-row w-full overflow-auto">
          {/* Left Section */}
          <div className="relative w-full lg:w-1/3 p-2 flex flex-col items-center">
            <div className="absolute top-2 left-2">
              <img
                src="https://via.placeholder.com/50"
                alt={tender.companyname}
                className="w-10 h-10 rounded-full mb-2"
              />
            </div>
            <div className="text-center text-black text-2xl font-bold mb-2">Tender {tender.id}</div>
            <div className={`px-2 py-1 rounded-full border-2 mb-2 ${statusStyles[tender.status]}`}>
              {tender.status}
            </div>
            <div className="text-gray-700 mb-2 text-left w-full">
              <strong className="block">Service Provider:</strong>
              <div className="text-center">{tender.companyname}</div>
            </div>
            <div className="text-gray-700 mb-2 text-left w-full">
              <strong className="block">Ticket ID:</strong>
              <div className="text-center">{tender.ticket_id}</div>
            </div>
            <div className="text-gray-700 mb-2 text-left w-full">
              <strong className="block">Issue Date:</strong>
              <div className="text-center">{tender.datetimesubmitted}</div>
            </div>
            <div className="text-gray-700 mb-2 text-left w-full">
              <strong className="block">Proposed Price:</strong>
              <div className="text-center">R{tender.quote.toFixed(2)}</div>
            </div>
            <div className="text-gray-700 mb-2 text-left w-full">
              <strong className="block">Estimated Duration:</strong>
              <div className="text-center">{tender.estimatedTimeHours} hours</div>
            </div>
            <div className="text-gray-700 mb-2 text-left w-full">
              <strong className="block">Upload:</strong>
              <div className="text-center">
                {tender.upload ? (
                  <a href={URL.createObjectURL(tender.upload)} download className="text-blue-500 underline ml-2">
                    {tender.upload.name}
                  </a>
                ) : (
                  "No files attached"
                )}
              </div>
            </div>
            <div className="flex flex-col items-center mb-4 w-full">
              <FaInfoCircle className="text-blue-500 mb-1" size={24} />
              <div className="text-gray-500 text-xs text-center">
                This Tender Contract is currently {tender.status}. {tender.companyname} has
                {tender.hasReportedCompletion ? '' : ' not'} submitted a completion report.
              </div>
            </div>
            <div className="mt-2 flex justify-center gap-2">
              <button className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300" onClick={onClose}>
                Back
              </button>
              {tender.status === "Active" && (
                <>
                  <button className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600">
                    Terminate Contract
                  </button>
                  <button className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">
                    Mark as Complete
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Right Section */}
          <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center p-4">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Map Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ActiveTenders() {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 10;

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

  return (
    <div className="overflow-x-auto bg-transparent rounded-lg shadow-md">
      <div className="min-w-full text-white text-opacity-80 rounded-t-lg text-black relative">
        <div className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 font-bold text-center border-b border-gray-200">
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Tender ID</div>
          <div className="col-span-1">Ticket ID</div>
          <div className="col-span-1">Service Provider</div>
          <div className="col-span-1">Issue Date</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1">Estimated Duration</div>
        </div>
        <div className="min-w-full">
          {currentTenders.map((tender) => (
            <Tender key={tender.id} tender={tender} />
          ))}
        </div>
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
      </div>
    </div>
  );
}
