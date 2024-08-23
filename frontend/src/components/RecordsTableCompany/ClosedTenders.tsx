import React, { useState, useEffect, useRef } from "react";

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
  { id: "T001", ticketId: "SA0300", status: "Closed", municipality: "City of Cape Town", issueDate: "2023-07-01", price: 1500.5, estimatedDuration: 5, upload: null, hasReportedCompletion: false },
  { id: "T002", ticketId: "SA0302", status: "Closed", municipality: "City of Johannesburg", issueDate: "2023-07-02", price: 2000.0, estimatedDuration: 3, upload: null, hasReportedCompletion: false },
  { id: "T003", ticketId: "SA0304", status: "Rejected", municipality: "City of Tshwane", issueDate: "2023-07-03", price: 2500.75, estimatedDuration: 4, upload: null, hasReportedCompletion: false },
  { id: "T004", ticketId: "SA0306", status: "Closed", municipality: "Ekurhuleni Metropolitan Municipality", issueDate: "2023-07-04", price: 1800.0, estimatedDuration: 2, upload: null, hasReportedCompletion: true },
  { id: "T005", ticketId: "SA0310", status: "Rejected", municipality: "Nelson Mandela Bay Municipality", issueDate: "2023-07-05", price: 2200.0, estimatedDuration: 3, upload: null, hasReportedCompletion: false },
  { id: "T006", ticketId: "SA0300", status: "Closed", municipality: "Buffalo City Metropolitan Municipality", issueDate: "2023-07-06", price: 1700.5, estimatedDuration: 4, upload: null, hasReportedCompletion: true },
  { id: "T007", ticketId: "SA0304", status: "Closed", municipality: "Mangaung Metropolitan Municipality", issueDate: "2023-07-07", price: 2600.0, estimatedDuration: 5, upload: null, hasReportedCompletion: true },
  { id: "T008", ticketId: "SA0302", status: "Rejected", municipality: "City of Polokwane", issueDate: "2023-07-08", price: 2400.75, estimatedDuration: 2, upload: null, hasReportedCompletion: true },
  { id: "T009", ticketId: "SA0306", status: "Closed", municipality: "eThekwini Metropolitan Municipality", issueDate: "2023-07-09", price: 2100.0, estimatedDuration: 4, upload: null, hasReportedCompletion: false },
  { id: "T010", ticketId: "SA0310", status: "Rejected", municipality: "Msunduzi Local Municipality", issueDate: "2023-07-10", price: 1900.5, estimatedDuration: 3, upload: null, hasReportedCompletion: false },
  // Add more records as needed
];

const statusStyles = {
  Unassigned: "text-blue-500 border-blue-500 bg-white rounded-full",
  Active: "text-black bg-green-200 rounded-full",
  Rejected: "text-black bg-red-200 rounded-full",
  Closed: "text-black bg-gray-200 rounded-full",
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
    <div className="overflow-x-auto text-white text-center bg-transparent rounded-lg shadow-md">
      <div className="min-w-full text-white text-opacity-80 rounded-t-lg">
        <div className="text-xl my-4 font-bold">Closed or Rejected Tenders cannot be accessed.</div>
        <div className="grid grid-cols-7 gap-4 items-center mb-2 px-6 py-1 font-bold text-center border-b border-gray-200">
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Tender ID</div>
          <div className="col-span-1">Ticket ID</div>
          <div className="col-span-1">Municipality</div>
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
  className={`px-2 py-1 rounded font-bold ${statusStyles[tender.status]}`}
  style={{ minWidth: "150px", display: "inline-block", textAlign: "center" }}
>
  {tender.status}
</span>

              </div>
              <div className="col-span-1 flex justify-center font-bold">{tender.id}</div>
              <div className="col-span-1 flex justify-center">{tender.ticketId}</div>
              <div className="col-span-1 flex justify-center text-center truncate overflow-hidden">
                <div
                  className="overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ fontSize: "1rem", minWidth: "0", maxWidth: "100%", width: "fit-content" }}
                  title={tender.municipality}
                >
                  {tender.municipality}
                </div>
              </div>
              <div className="col-span-1 flex justify-center">{tender.issueDate}</div>
              <div className="col-span-1 flex justify-center">R{tender.price.toFixed(2)}</div>
              <div className="col-span-1 flex justify-center">{tender.estimatedDuration} days</div>
            </div>
          ))}
        </div>
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
      </div>
    </div>
  );
}
