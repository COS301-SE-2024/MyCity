import React, { useState } from "react";

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
  { id: "T001", ticketId: "SA0300", status: "Closed", municipality: "City of Cape Town", issueDate: "2023-07-01", price: 1500.5, estimatedDuration: 5, upload: null, hasReportedCompletion: false },
  { id: "T002", ticketId: "SA0302", status: "Closed", municipality: "City of Johannesburg", issueDate: "2023-07-02", price: 2000.0, estimatedDuration: 3, upload: null, hasReportedCompletion: false },
  { id: "T003", ticketId: "SA0304", status: "Rejected", municipality: "City of Tshwane", issueDate: "2023-07-03", price: 2500.75, estimatedDuration: 4, upload: null, hasReportedCompletion: false },
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
    <>
      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto bg-transparent rounded-lg shadow-md">
        <div className="min-w-full text-white text-opacity-80 rounded-t-lg text-black relative">
          <div className="text-xl font-bold text-center">
            See all Closed/Rejected Tenders.
          </div>
          <div className="grid grid-cols-6 gap-4 items-center mt-6 mb-2 px-8 py-1 font-bold text-center border-b border-gray-200">
            <div className="col-span-1">Tender ID</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Ticket ID</div>
            <div className="col-span-1">Municipality</div>
            <div className="col-span-1">Issue Date</div>
            <div className="col-span-1">Price</div>
          </div>
          <div className="min-w-full px-6">
            {currentTenders.map((tender) => (
              <div
                key={tender.id}
                className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200"
              >
                <div className="col-span-1 flex justify-center font-bold">
                  {tender.id}
                </div>
                <div className="col-span-1 flex justify-center">
                  <span
                    className={`px-2 py-1 rounded-full text-center font-bold ${statusStyles[tender.status]}`}
                    style={{ minWidth: "150px" }}
                  >
                    {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                  </span>
                </div>
                <div className="col-span-1 flex justify-center">
                  {tender.ticketId}
                </div>
                <div className="col-span-1 flex justify-center truncate overflow-hidden">
                  <div className="overflow-hidden whitespace-nowrap text-ellipsis" title={tender.municipality}>
                    {tender.municipality}
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  {tender.issueDate}
                </div>
                <div className="col-span-1 flex justify-center">
                  R{tender.price}
                </div>
              </div>
            ))}
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
        <div className="text-xl font-bold text-white text-opacity-80 text-center mb-4">
          See all Closed/Rejected Tenders.
        </div>

        {/* Closed Tenders Listing and Pagination Container */}
        <div className="min-w-full space-y-2 overflow-y-auto pb-32" style={{ maxHeight: "75vh" }}>
          {currentTenders.length > 0 ? (
            currentTenders.map((tender) => (
              <div
                key={tender.id}
                className="p-4 mb-2 rounded-3xl bg-white bg-opacity-70 text-black border border-gray-300 shadow-md"
              >
                <div className="flex justify-between mb-2">
                  <div className="font-bold text-lg">{tender.id}</div>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${statusStyles[tender.status]}`}>
                    {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <div>
                    <span className="font-bold">Ticket ID: </span>{tender.ticketId}
                  </div>
                  <div>
                    {tender.municipality}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-bold">Issue Date: </span>{tender.issueDate}
                  </div>
                  <div>
                    <span className="font-bold">Price: </span>R{tender.price}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-16 text-white text-opacity-80 text-center">
              No Closed Tenders to display.
            </div>
          )}

          {/* Pagination (comes directly after the last tender) */}
          {currentTenders.length > 0 && (
            <div className="flex justify-center items-center mt-4 text-white space-x-4 pb-10">
              <button
                onClick={handlePrevPage}
                className={`px-4 py-2 text-md ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-md">Page {currentPage} of {totalPages}</span>
              <button
                onClick={handleNextPage}
                className={`px-4 py-2 text-md ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
