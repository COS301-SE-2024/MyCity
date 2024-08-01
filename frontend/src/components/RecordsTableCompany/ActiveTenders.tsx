import React, { useState } from "react";
import Tender from "../Tenders/CompanyTenderMini"; // Update the import path if necessary
import { FaInfoCircle, FaTimes } from "react-icons/fa";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  id: string;
  ticketId: string;
  status: Status;
  municipality: string;
  issueDate: string;
  price: number;
  estimatedDuration: number;
  upload: File | null;
  hasReportedCompletion: boolean;
}

const tenders: TenderType[] = [
  // Mock data
  {
    id: "T001",
    ticketId: "SA0300",
    status: "Active",
    municipality: "City of Cape Town",
    issueDate: "2023-07-01",
    price: 1500.5,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T002",
    ticketId: "SA0302",
    status: "Active",
    municipality: "City of Johannesburg",
    issueDate: "2023-07-02",
    price: 2000.0,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T003",
    ticketId: "SA0304",
    status: "Active",
    municipality: "eThekwini Municipality",
    issueDate: "2023-07-03",
    price: 2500.75,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T004",
    ticketId: "SA0306",
    status: "Active",
    municipality: "City of Tshwane",
    issueDate: "2023-07-04",
    price: 1800.0,
    estimatedDuration: 2,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T005",
    ticketId: "SA0310",
    status: "Active",
    municipality: "Nelson Mandela Bay",
    issueDate: "2023-07-05",
    price: 2200.0,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T006",
    ticketId: "SA0300",
    status: "Active",
    municipality: "Buffalo City",
    issueDate: "2023-07-06",
    price: 1700.5,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T007",
    ticketId: "SA0304",
    status: "Active",
    municipality: "Mangaung Metropolitan Municipality",
    issueDate: "2023-07-07",
    price: 2600.0,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T008",
    ticketId: "SA0302",
    status: "Active",
    municipality: "City of Polokwane",
    issueDate: "2023-07-08",
    price: 2400.75,
    estimatedDuration: 2,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T009",
    ticketId: "SA0306",
    status: "Active",
    municipality: "Mbombela Local Municipality",
    issueDate: "2023-07-09",
    price: 2100.0,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T010",
    ticketId: "SA0310",
    status: "Active",
    municipality: "Sol Plaatje Municipality",
    issueDate: "2023-07-10",
    price: 1900.5,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T011",
    ticketId: "SA0300",
    status: "Active",
    municipality: "City of Ekurhuleni",
    issueDate: "2023-07-11",
    price: 2300.0,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T012",
    ticketId: "SA0304",
    status: "Active",
    municipality: "Mossel Bay Municipality",
    issueDate: "2023-07-12",
    price: 2500.0,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T013",
    ticketId: "SA0302",
    status: "Active",
    municipality: "George Municipality",
    issueDate: "2023-07-13",
    price: 2000.5,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T014",
    ticketId: "SA0306",
    status: "Active",
    municipality: "City of Mbombela",
    issueDate: "2023-07-14",
    price: 2200.0,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T015",
    ticketId: "SA0310",
    status: "Active",
    municipality: "Steve Tshwete Local Municipality",
    issueDate: "2023-07-15",
    price: 1800.75,
    estimatedDuration: 2,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T016",
    ticketId: "SA0300",
    status: "Active",
    municipality: "Govan Mbeki Municipality",
    issueDate: "2023-07-16",
    price: 2700.0,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T017",
    ticketId: "SA0304",
    status: "Active",
    municipality: "City of Matlosana",
    issueDate: "2023-07-17",
    price: 2600.5,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T018",
    ticketId: "SA0302",
    status: "Active",
    municipality: "Emfuleni Local Municipality",
    issueDate: "2023-07-18",
    price: 2100.0,
    estimatedDuration: 2,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T019",
    ticketId: "SA0306",
    status: "Active",
    municipality: "City of uMhlathuze",
    issueDate: "2023-07-19",
    price: 2300.75,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T020",
    ticketId: "SA0310",
    status: "Active",
    municipality: "Stellenbosch Municipality",
    issueDate: "2023-07-20",
    price: 2500.0,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: true,
  },
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
          <div className="col-span-1">Municipality</div>
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
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
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
