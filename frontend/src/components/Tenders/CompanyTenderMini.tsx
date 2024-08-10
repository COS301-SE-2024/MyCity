import React, { useEffect, useRef, useState } from 'react';
import TenderMax from './CompanyTenderMax'; // Assuming the detailed view component is in the same directory
import { useProfile } from "@/hooks/useProfile";
import { getContract,getCompanyContract } from '@/services/tender.service';


type Status = 'Unassigned' | 'Active' | 'Rejected' | 'Closed';

interface TenderType {
  tendernumber: string;
  tender_id : string;
  company_id: string;
  companyname: string;
  serviceProvider: string;
  datetimesubmitted: string;
  ticket_id: string;
  status: string;
  quote: number;
  estimatedTimeHours: number;
  municipality : string;
  ticketnumber : string;
  upload: File | null;
  hasReportedCompletion: boolean | false; // New prop
}

const statusStyles = {
  'under_review': 'border-blue-500 text-blue-500 bg-white',
  'accepted': 'bg-green-200 text-green',
  'approved': 'bg-green-200 text-green',
  'rejected': 'bg-red-200 text-red',
  'submitted' : 'bg-gray-200 text-gray'
};


export default function Tender({ tender }: { tender: TenderType }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [contract,setContract] = useState<any>();
  const userProfile = useProfile();
  const textRef = useRef<HTMLSpanElement>(null);

  const formateddate = tender.datetimesubmitted.split('T')[0]
  let estimateddays = Math.ceil(tender.estimatedTimeHours/24);
  if(estimateddays == 0)
  {
    estimateddays = 1;
  }
  const tenderStatus = tender.status.charAt(0).toUpperCase() + tender.status.slice(1);


  function getStatus(){
    switch (tender.status) {
      case "rejected":
        return "rejected"
        break;
      case "accepted":
        return "accepted"
      case "approved":
        return "approved"
        break;
      case "under review":
        return "under_review"
        break;
      case "submitted":
        return "submitted"
        break;
      default:
        return "submitted"
        break;
    }
  }
  

  const handleTenderClick = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const compant_name = String(user_data.current?.company_name)
      const rspcontracts = await getCompanyContract(compant_name,tender.tender_id,user_session)
      if(rspcontracts == null)
      {
        setShowDetails(false)
      }
      else 
      {
        setContract(rspcontracts)
        setShowDetails(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClose = () => {
    setShowDetails(false);
  };

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, []);

  return (
    <>
      <div
        className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200 hover:bg-opacity-80 cursor-pointer"
        onClick={handleTenderClick}
      >
        <div className="col-span-1 flex justify-center">
          <span className={`px-2 py-1 rounded border ${statusStyles[getStatus()]}`}>
            {tender.status}
          </span>
        </div>
        <div className="col-span-1 flex justify-center font-bold">{tender.tendernumber}</div>
        <div className="col-span-1 flex justify-center">{tender.ticketnumber}</div>
        <div className="col-span-1 flex justify-center relative overflow-hidden">
          <span ref={textRef} className={`inline-block ${isOverflowing ? 'scrolling-text' : ''}`}>
            {tender.municipality}
          </span>
        </div>
        <div className="col-span-1 flex justify-center">{formateddate}</div>
        <div className="col-span-1 flex justify-center">R{tender.quote.toFixed(2)}</div>
        <div className="col-span-1 flex justify-center">{estimateddays} days</div>
      </div>

      {showDetails && <TenderMax tender={contract} onClose={handleClose} municipality={tender.municipality} />}

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .scrolling-text {
          white-space: nowrap;
          animation: scroll 10s linear infinite;
        }
        .overflow-hidden {
          max-width: 150px; /* Adjust as needed to limit the scroll area */
          text-align: center;
        }
      `}</style>
    </>
  );
}
