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
    <div className="space-y-1 px-6 rounded-3xl">
      {tickets.map((ticket: Ticket, index: number) => (
        <div key={index} className="grid grid-cols-6 gap-2 bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4">
          {/* First Field - Ticket */}
          <div className="flex flex-col justify-center font-bold items-center">
            <span className="text-s text-black-500">Ticket</span>
          </div>

          {/* Second Field - Urgent */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-black">Urgent</span>
            <AlertTriangle size={40} color='red' />
          </div>

          {/* Third Field - Asset Type */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-black">Asset Type</span>
            <span className="text-black">{ticket.asset_id}</span>
          </div>

          {/* Fourth Field - Date Opened */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-black">Date Opened</span>
            <span className="text-black">{new Date(ticket.dateOpened).toLocaleDateString()}</span>
          </div>

          {/* Fifth Field - Municipality */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-black">Municipality</span>
            <span className="text-black">{ticket.municipality_id}</span>
          </div>

          {/* Sixth Field - State */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-black">State</span>
            <span className="text-black">{ticket.state}</span>
          </div>

        </div>
      ))}
    </div>
  );
};

export default SearchTicket;
