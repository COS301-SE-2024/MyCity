import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { FaArrowUp, FaEye } from 'react-icons/fa';

interface Ticket {
  //not the only components of a ticket (merely the one we are using)
  ticket_id: string;
  asset_id: string;
  dateOpened: string;
  municipality_id: string;
  state: string;
  upvotes: number;
  viewCount: number;
}

interface SearchTicketProps {
  tickets: Ticket[];
}

const SearchTicket: React.FC<SearchTicketProps> = ({ tickets }) => {
  if (!tickets || tickets.length === 0) {
    return <div>No tickets found.</div>;
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket: Ticket, index: number) => (
        <div key={index} className="grid grid-cols-6 gap-4 bg-white rounded-md shadow-md p-4">
          {/* First Field - Ticket */}
          <div className="flex flex-col items-center">
            <span className="text-s text-black-500">Ticket</span>
          </div>

          {/* Second Field - Urgent */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Urgent</span>
            <AlertTriangle size={40} color='red' />
          </div>

          {/* Third Field - Asset Type */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Asset Type</span>
            <span className="text-gray-800">{ticket.asset_id}</span>
          </div>

          {/* Fourth Field - Date Opened */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Date Opened</span>
            <span className="text-gray-800">{new Date(ticket.dateOpened).toLocaleDateString()}</span>
          </div>

          {/* Fifth Field - Municipality */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Municipality</span>
            <span className="text-gray-800">{ticket.municipality_id}</span>
          </div>

          {/* Sixth Field - State */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">State</span>
            <span className="text-gray-800">{ticket.state}</span>
          </div>

        </div>
      ))}
    </div>
  );
};

export default SearchTicket;
