
import React, { useState } from 'react';
import TenderMax from './MuniTenderMax'; // Assuming the detailed view component is in the same directory

type Status = 'Unassigned' | 'Active' | 'Rejected' | 'Closed';

interface TenderType {
  tender_id: string;
  tendernumber : string;
  company_id : string;
  companyname : string;
  datetimesubmitted : string;
  ticket_id: string;
  status: string;
  quote: number;
  estimatedTimeHours: number;
  upload: File | null;
  hasReportedCompletion: boolean | false; // New prop
}

function statusStyles(status : string) {
  switch (status){
    case 'rejected':
      return 'bg-red-200 text-black'
    case 'approved':
      return 'bg-green-200 text-black'
    case 'under review':
      return 'border-blue-500 text-blue-500 bg-white'
    case 'submitted':
      return 'bg-gray-200 text-black'
  }
  // 'Unassigned': 'border-blue-500 text-blue-500 bg-white',
  // 'Active': 'bg-green-200 text-black',
  // 'Rejected': 'bg-red-200 text-black',
  // 'Closed': 'bg-gray-200 text-black',
};


export default function Tender({ tender }: { tender: TenderType }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleTenderClick = () => {
    setShowDetails(true);
  };

  const handleClose = () => {
    setShowDetails(false);
  };

  function getDays(hours : number){
    return Math.ceil(hours/24)
  }

  return (
    <>
      <div
        className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200 hover:bg-opacity-80 cursor-pointer"
        onClick={handleTenderClick}
      >
        <div className="col-span-1 flex justify-center">
          <span className={`px-2 py-1 rounded border ${statusStyles(tender.status)}`}>
            {tender.status}
          </span>
        </div>
        <div className="col-span-1 flex justify-center font-bold">{tender.tendernumber}</div>
        <div className="col-span-1 flex justify-center">{tender.ticketId}</div>
        <div className="col-span-1 flex justify-center">{tender.companyname}</div>
        <div className="col-span-1 flex justify-center">{tender.datetimesubmitted}</div>
        <div className="col-span-1 flex justify-center">R{tender.quote.toFixed(2)}</div>
        <div className="col-span-1 flex justify-center">{getDays(tender.estimatedTimeHours)} days</div>
      </div>

      {showDetails && <TenderMax tender={tender} onClose={handleClose} />}
    </>
  );
}
