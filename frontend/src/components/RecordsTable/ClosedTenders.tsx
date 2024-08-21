import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  id: string;
  ticketId: string;
  status: Status;
  serviceProvider: string;
  issueDate: string;
  price: number;
  estimatedDuration: number;
  upload: File | null;
  hasReportedCompletion: boolean;
}

const tenders: TenderType[] = [
  //mock data
  {
    id: "T001",
    ticketId: "SA0300",
    status: "Closed",
    serviceProvider: "Service Provider A",
    issueDate: "2023-07-01",
    price: 1500.5,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T002",
    ticketId: "SA0302",
    status: "Closed",
    serviceProvider: "Service Provider B",
    issueDate: "2023-07-02",
    price: 2000.0,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T003",
    ticketId: "SA0304",
    status: "Rejected",
    serviceProvider: "Service Provider C",
    issueDate: "2023-07-03",
    price: 2500.75,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T004",
    ticketId: "SA0306",
    status: "Closed",
    serviceProvider: "Service Provider D",
    issueDate: "2023-07-04",
    price: 1800.0,
    estimatedDuration: 2,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T005",
    ticketId: "SA0310",
    status: "Rejected",
    serviceProvider: "Service Provider E",
    issueDate: "2023-07-05",
    price: 2200.0,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T006",
    ticketId: "SA0300",
    status: "Closed",
    serviceProvider: "Service Provider F",
    issueDate: "2023-07-06",
    price: 1700.5,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T007",
    ticketId: "SA0304",
    status: "Closed",
    serviceProvider: "Service Provider G",
    issueDate: "2023-07-07",
    price: 2600.0,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T008",
    ticketId: "SA0302",
    status: "Rejected",
    serviceProvider: "Service Provider H",
    issueDate: "2023-07-08",
    price: 2400.75,
    estimatedDuration: 2,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T009",
    ticketId: "SA0306",
    status: "Closed",
    serviceProvider: "Service Provider I",
    issueDate: "2023-07-09",
    price: 2100.0,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T010",
    ticketId: "SA0310",
    status: "Rejected",
    serviceProvider: "Service Provider J",
    issueDate: "2023-07-10",
    price: 1900.5,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T011",
    ticketId: "SA0300",
    status: "Closed",
    serviceProvider: "Service Provider K",
    issueDate: "2023-07-11",
    price: 2300.0,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T012",
    ticketId: "SA0304",
    status: "Rejected",
    serviceProvider: "Service Provider L",
    issueDate: "2023-07-12",
    price: 2500.0,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T013",
    ticketId: "SA0302",
    status: "Closed",
    serviceProvider: "Service Provider M",
    issueDate: "2023-07-13",
    price: 2000.5,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T014",
    ticketId: "SA0306",
    status: "Closed",
    serviceProvider: "Service Provider N",
    issueDate: "2023-07-14",
    price: 2200.0,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T015",
    ticketId: "SA0310",
    status: "Closed",
    serviceProvider: "Service Provider O",
    issueDate: "2023-07-15",
    price: 1800.75,
    estimatedDuration: 2,
    upload: null,
    hasReportedCompletion: true,
  },
  {
    id: "T016",
    ticketId: "SA0300",
    status: "Rejected",
    serviceProvider: "Service Provider P",
    issueDate: "2023-07-16",
    price: 2700.0,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T017",
    ticketId: "SA0304",
    status: "Closed",
    serviceProvider: "Service Provider Q",
    issueDate: "2023-07-17",
    price: 2600.5,
    estimatedDuration: 3,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T018",
    ticketId: "SA0302",
    status: "Rejected",
    serviceProvider: "Service Provider R",
    issueDate: "2023-07-18",
    price: 2100.0,
    estimatedDuration: 2,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T019",
    ticketId: "SA0306",
    status: "Closed",
    serviceProvider: "Service Provider S",
    issueDate: "2023-07-19",
    price: 2300.75,
    estimatedDuration: 5,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "T020",
    ticketId: "SA0310",
    status: "Rejected",
    serviceProvider: "Service Provider T",
    issueDate: "2023-07-20",
    price: 2500.0,
    estimatedDuration: 4,
    upload: null,
    hasReportedCompletion: true,
  },
];

const statusStyles = {
  Unassigned: "text-black bg-blue-200 border-blue-200 rounded-full",
  Active: "text-black bg-green-200 border-green-200 rounded-full",
  Rejected: "text-black bg-red-200 border-red-200 rounded-full",
  Closed: "text-black bg-gray-200 border-gray-200 rounded-full",
};

export default function ClosedTenders() {
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
        <div className="min-w-full px-6">
          {currentTenders.map((tender) => (
            <div
              key={tender.id}
              className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200"
            >
              <div className="col-span-1 flex justify-center">
                <span
                  className={`py-1 rounded-3xl text-center font-bold ${
                    statusStyles[tender.status]
                  }`}
                  style={{ minWidth: "150px" }} // Normalizing dimensions based on 'Taking Tenders'
                >
                  {tender.status}
                </span>
              </div>

              <div className="col-span-1 flex justify-center font-bold">
                {tender.id}
              </div>
              <div className="col-span-1 flex justify-center">
                {tender.ticketId}
              </div>
              <div className="col-span-1 flex justify-center">
                {tender.serviceProvider}
              </div>
              <div className="col-span-1 flex justify-center">
                {tender.issueDate}
              </div>
              <div className="col-span-1 flex justify-center">
                R{tender.price.toFixed(2)}
              </div>
              <div className="col-span-1 flex justify-center">
                {tender.estimatedDuration} days
              </div>
            </div>
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
