import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { AlertCircle } from 'lucide-react';

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";
type Urgency = 'high' | 'medium' | 'low';

interface TicketType {
  ticket_id: string;
  ticketnumber : string;
  asset_id: string;
  user_picture : string;
  municipality_picture : string ;
  description : string;
  imageURL : string;
  state: string;
  address: string;
  createdby: string;
  viewcount : number;
  commentcount: number;
  latitude : string;
  longitude : string;
  upvotes : number;
  municipality : string;
  upload: File | null;
  hasReportedCompletion: boolean;
}

interface UrgencyMappingType {
  [key: string]: { icon: JSX.Element, label: string };
}

const urgencyMapping: UrgencyMappingType = {
  high: { icon: <AlertCircle className="text-red-500" />, label: 'Urgent' },
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: 'Moderate' },
  low: { icon: <AlertCircle className="text-green-500" />, label: 'Not Urgent' }
};


  //mock data
  

const statusStyles = {
  Opened : "text-green-500 bg-green-200 bg-green-200 rounded-full",
  In_Progress: "text-blue-500 bg-blue-200 bg-blue-200 rounded-full",
  Assigning_Contract: "text-blue-500 bg-blue-200 bg-blue-200 rounded-full",
  Closed: "text-red-500 bg-red-200 border-red-200 rounded-full",
};

export default function ClosedTenders({tickets} : {tickets : TicketType[]}) {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 10;

  // Calculate pagination detail
  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTickets = tickets.slice(indexOfFirstTender, indexOfLastTender);
  const totalPages = Math.ceil(tickets.length / tendersPerPage);
  const Closedtickets = currentTickets.filter(ticket => ticket.state == "Closed");

  function getStatus(state : string){
    switch (state) {
      case "Closed":
        return "Closed"
        break;
      case "Opened":
        return "Opened";
        break;
      case "In Progress":
        return "In_Progress";
        break;
      case "Assigning Contract":
        return "Assigning_Contract";
        break;
      default:
        return "Closed"
        break;
    }
  }

  function UrgencyIcon(votes : number) {
    const urgency = urgencyMapping[getUrgency(votes)] || urgencyMapping.low;
    return urgency.icon;
  }

  const getUrgency = (votes : number) =>{
        if (votes < 10) {
        return "low";
      } else if (votes >= 10 && votes < 20) {
          return "medium";
      } else if (votes >= 20 && votes <= 40) {
          return "high";
      } else {
          return "low"; // Default case
      }
  }

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
        <div className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 font-bold text-center border-b border-gray-200">
          <div className="col-span-1">Urgency</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Fault Type</div>
          <div className="col-span-1">Ticket number</div>
          <div className="col-span-1">Created By</div>
          <div className="col-span-1">Address</div>
        </div>
        <div className="min-w-full">
          {Closedtickets.map((ticket) => (
            <div
              key={ticket.ticket_id}
              className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200"
            >
              <div className="col-span-1 flex justify-center">{UrgencyIcon(ticket.upvotes)}</div>
              <div className="col-span-1 flex justify-center">
                <span className={`px-2 py-1 rounded border ${statusStyles[getStatus(ticket.state)]}`}>
                  {ticket.state}
                </span>
              </div>
              <div className="col-span-1 flex justify-center">{ticket.asset_id}</div>
              <div className="col-span-1 flex justify-center">{ticket.ticketnumber}</div>
              <div className="col-span-1 flex justify-center">{ticket.createdby}</div>
              <div className="col-span-1 flex justify-center">{ticket.address}</div>

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
