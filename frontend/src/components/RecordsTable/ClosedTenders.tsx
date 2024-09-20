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
  const tendersPerPage = 10;

  // Filter Closed tickets
  const closedTickets = tickets.filter((ticket) => ticket.state === "Closed");

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
          <div className="grid grid-cols-5 gap-4 items-center mt-6 mb-2 px-8 py-1 font-bold text-center border-b border-gray-200">
            <div className="col-span-1">Ticket Number</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Fault Type</div>
            <div className="col-span-1">Created By</div>
            <div className="col-span-1">Address</div>
          </div>
          <div className="min-w-full px-6">
            {currentTickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200"
              >
                <div className="col-span-1 flex justify-center font-bold">
                  {ticket.ticketnumber}
                </div>
                <div className="col-span-1 flex justify-center">
                  <span
                    className={`py-1 rounded-3xl text-center font-bold ${getStatusClass(ticket.state)}`}
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
        <div className="text-xl font-bold text-white text-center text-opacity-80 mb-4">See all Closed/Rejected Tenders.</div>
        <div className="min-w-full">
          {currentTickets.length > 0 ? (
            currentTickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200"
              >
                <div className="col-span-1 flex justify-center font-bold">
                  {ticket.ticketnumber}
                </div>
                <div className="col-span-1 flex justify-center">
                  <span
                    className={`py-1 rounded-3xl text-center font-bold ${getStatusClass(ticket.state)}`}
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
              </div>
            ))
          ) : (
            <div className="mt-16 text-white text-opacity-80 text-center">No Closed Tenders to display.</div>
          )}
        </div>
  
        {closedTickets.length > 0 && (
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
