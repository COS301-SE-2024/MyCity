import React, { useEffect, useState } from 'react';
import TenderMax from './MuniTenderMax'; // Assuming the detailed view component is in the same directory
import TenderContainer from './TendersTemplate';
import { VscSymbolBoolean } from 'react-icons/vsc';
type Status = 'Unassigned' | 'Active' | 'Rejected' | 'Closed';

interface TenderType {
  tender_id: string;
  tendernumber : string;
  company_id : string;
  companyname : string;
  datetimesubmitted : string;
  ticket_id: string;
  ticketnumber : string;
  status: string;
  quote: number;
  estimatedTimeHours: number;
  longitude : string;
  latitude : string;
  upload: File | null;
  hasReportedCompletion: boolean;
}

function statusStyles(status: String) {
  switch (status) {
    case 'rejected':
      return 'bg-red-200 text-red';
    case 'approved':
      return 'bg-green-200 text-green';
    case 'under review':
      return 'border-blue-500 text-blue-500 bg-white';
    case 'submitted':
      return 'bg-gray-200 text-gray';
    case 'reject':
      return 'bg-red-200 text-red';
  }
}


export default function Tender({ tender,onClose }: { tender: TenderType,onClose: (data : number) => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const [rerender,setRerender] = useState<boolean>()
  const [status,setStatus] = useState<String>("")

  const datesubmitted = tender.datetimesubmitted.split('T')[0]

  useEffect(()=>{
    setStatus(tender.status)
  },[tender.status])

  const handleTenderClick = () => {
    setShowDetails(true);
  };

  const handleClose = async (data : number) => {
    console.log("Data :" + data)
    setShowDetails(false);
    if (data !== undefined) {
      console.log("inside switch statement")
      switch (data) {
        case 1:
          {
            setStatus("approved")
            onClose(1)
          }
          break;
        case 2:
          {
            console.log("Inside the reject switch")
            setStatus("rejected")
            onClose(0)
          }
          break;
        default:
          break;
      }
    }
  };

  function getDays(hours: number) {
    return Math.ceil(hours / 24);
  }



  return (
    <>
      <div
        className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200 hover:bg-opacity-80 cursor-pointer"
        onClick={handleTenderClick}
      >
        <div className="col-span-1 flex justify-center">
          <span className={`px-2 py-1 rounded border ${statusStyles(status)}`}>
            {status}
          </span>
        </div>
        <div className="col-span-1 flex justify-center font-bold">{tender.tendernumber}</div>
        <div className="col-span-1 flex justify-center">{tender.companyname}</div>
        <div className="col-span-1 flex justify-center">{datesubmitted}</div>
        <div className="col-span-1 flex justify-center">R{tender.quote.toFixed(2)}</div>
        <div className="col-span-1 flex justify-center">{getDays(tender.estimatedTimeHours)} days</div>
      </div>
      {showDetails && (
         <TenderContainer tender={tender} onClose={handleClose}/>

      )}

      {/* Removed so build can run */}
      {/* {showDetails && <TenderMax tender={tender} onClose={handleClose} />} */}
    </>
  );
}
