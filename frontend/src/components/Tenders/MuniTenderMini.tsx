import React, { useState } from 'react';
import TenderMax from './MuniTenderMax'; // Assuming the detailed view component is in the same directory

type Status = 'Unassigned' | 'Active' | 'Rejected' | 'Closed';

interface TenderType {
  id: string;
  ticketId: string;
  status: Status;
  serviceProvider: string;
  issueDate: string;
  price: number;
  estimatedDuration: number;
  upload: File | null;
  hasReportedCompletion: boolean; // New prop
}

const statusStyles = {
  'Unassigned': 'border-blue-500 text-blue-500 bg-white',
  'Active': 'bg-green-200 text-black',
  'Rejected': 'bg-red-200 text-black',
  'Closed': 'bg-gray-200 text-black',
};

export default function Tender({ tender }: { tender: TenderType }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleTenderClick = () => {
    setShowDetails(true);
  };

  const handleClose = () => {
    setShowDetails(false);
  };

  return (
    <>
      <div
        className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200 hover:bg-opacity-80 cursor-pointer"
        onClick={handleTenderClick}
      >
        <div className="col-span-1 flex justify-center">
          <span className={`px-2 py-1 rounded border ${statusStyles[tender.status]}`}>
            {tender.status}
          </span>
        </div>
        <div className="col-span-1 flex justify-center font-bold">{tender.id}</div>
        <div className="col-span-1 flex justify-center">{tender.ticketId}</div>
        <div className="col-span-1 flex justify-center">{tender.serviceProvider}</div>
        <div className="col-span-1 flex justify-center">{tender.issueDate}</div>
        <div className="col-span-1 flex justify-center">R{tender.price.toFixed(2)}</div>
        <div className="col-span-1 flex justify-center">{tender.estimatedDuration} days</div>
      </div>

      {showDetails && <TenderMax tender={tender} onClose={handleClose} />}
    </>
  );
}
