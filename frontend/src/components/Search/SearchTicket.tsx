import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Ticket } from '@/types/custom.types';

interface SearchTicketProps {
  tickets: Ticket[];
}

const SearchTicket: React.FC<SearchTicketProps> = ({ tickets }) => {
  /*if (!tickets || tickets.length === 0) {
    return <div>No tickets found.</div>;
  }*/

  return (
    <div className="space-y-4">
      {tickets.map((ticket: Ticket, index: number) => (
        <div key={index} className="grid grid-cols-6 gap-4 bg-white bg-opacity-70 rounded-md mt-4 shadow-md p-4">
          {/* First Field - Ticket */}
          <div className="flex flex-col justify-center items-center">
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
