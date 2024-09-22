import React, { useState } from "react";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TicketType {
  ticket_id: string;
  ticketnumber: string;
  asset_id: string;
  user_picture: string;
  municipality_picture: string;
  description: string;
  imageURL: string;
  state: string;
  address: string;
  createdby: string;
  viewcount: number;
  commentcount: number;
  latitude: string;
  longitude: string;
  upvotes: number;
  municipality: string;
  upload: File | null;
  hasReportedCompletion: boolean;
}

const statusStyles = {
  Unassigned: "text-blue-500 border-blue-500 bg-white rounded-full",
  Active: "text-black bg-green-200 rounded-full",
  Rejected: "text-black bg-red-200 rounded-full",
  Closed: "text-black bg-gray-200 rounded-full",
};

export default function ClosedTenders({ tickets }: { tickets: TicketType[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 5; // Changed to fit fewer tickets per page for better UX

  // Filter Closed tickets
  const closedTickets = tickets.filter((ticket) => ticket.state === "Closed" || ticket.state === "Rejected");

  // Calculate pagination details
  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTickets = closedTickets.slice(indexOfFirstTender, indexOfLastTender);
  const totalPages = Math.ceil(closedTickets.length / tendersPerPage);

  const truncateAddress = (address: string) => {
    const commaIndex = address.indexOf(",");
    return commaIndex === -1 ? address : address.substring(0, commaIndex);
  };

  const getStatusClass = (state: string) => {
    switch (state) {
      case "Closed":
      case "Rejected":
        return statusStyles.Closed;
      case "Unassigned":
        return statusStyles.Unassigned;
      case "Active":
        return statusStyles.Active;
      default:
        return statusStyles.Closed;
    }
  };

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
            <div className="col-span-1">Ticket Number</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Fault Type</div>
            <div className="col-span-1">Created By</div>
            <div className="col-span-1">Address</div>
            <div className="col-span-1">Upvotes</div>
          </div>
          <div className="min-w-full px-6">
            {currentTickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200"
              >
                <div className="col-span-1 flex justify-center font-bold">
                  {ticket.ticketnumber}
                </div>
                <div className="col-span-1 flex justify-center">
                  <span
                    className={`px-2 py-1 rounded-full text-center font-bold ${getStatusClass(ticket.state)}`}
                    style={{ minWidth: "150px" }}
                  >
                    {ticket.state}
                  </span>
                </div>
                <div className="col-span-1 flex text-center justify-center">
                  {ticket.asset_id}
                </div>
                <div className="col-span-1 flex justify-center">
                  {ticket.createdby}
                </div>
                <div className="col-span-1 flex justify-center">
                  {truncateAddress(ticket.address)}
                </div>
                <div className="col-span-1 flex justify-center">
                  {ticket.upvotes}
                </div>
              </div>
            ))}
          </div>
          {closedTickets.length > 0 && (
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
  <div className="text-xl font-bold text-white text-center text-opacity-80 mb-4">
    See all Closed/Rejected Tenders.
  </div>

  {/* Closed Tenders Listing and Pagination Container */}
  <div className="min-w-full space-y-2 overflow-y-auto pb-32" style={{ maxHeight: "75vh" }}>
    {currentTickets.length > 0 ? (
      currentTickets.map((ticket) => (
        <div
          key={ticket.ticket_id}
          className="p-4 mb-2 rounded-3xl bg-white bg-opacity-70 text-black border border-gray-300 shadow-md"
        >
          <div className="flex justify-between mb-2">
            <div className="font-bold text-lg">{ticket.ticketnumber}</div>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusClass(ticket.state)}`}>
              {ticket.state}
            </span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <div>
              <span className="font-bold">Asset: </span>{ticket.asset_id}
            </div>
            <div>
              <span className="font-bold">Created By: </span>{ticket.createdby}
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="w-1/2 truncate whitespace-nowrap">
              <span className="font-bold">Address: </span>{truncateAddress(ticket.address)}
            </div>
            <div>
              <span className="font-bold">Upvotes: </span>{ticket.upvotes}
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
    {currentTickets.length > 0 && (
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
