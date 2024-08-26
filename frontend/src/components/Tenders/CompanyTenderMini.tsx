import React, { useEffect, useRef, useState } from 'react';
import TenderMax from './CompanyTenderMax'; // Assuming the detailed view component is in the same directory
import { useProfile } from "@/hooks/useProfile";
import { getCompanyContract } from '@/services/tender.service';

type Status = 'Unassigned' | 'Active' | 'Rejected' | 'Closed';

interface TenderType {
  tendernumber: string;
  tender_id: string;
  company_id: string;
  companyname: string;
  serviceProvider: string;
  datetimesubmitted: string;
  ticket_id: string;
  status: string;
  quote: number;
  estimatedTimeHours: number;
  municipality: string;
  ticketnumber: string;
  longitude: string;
  latitude: string;
  upload: File | null;
  hasReportedCompletion: boolean | false; // New prop
}

const statusStyles = {
  'under_review': 'border-blue-500 text-blue-500 bg-white',
  'accepted': 'bg-green-200 text-green',
  'approved': 'bg-green-200 text-green',
  'rejected': 'bg-red-200 text-red',
  'submitted': 'bg-gray-200 text-gray',
};

export default function Tender({ tender }: { tender: TenderType }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [contract, setContract] = useState<any>();
  const userProfile = useProfile();
  const textRef = useRef<HTMLSpanElement>(null);

  const formattedDate = tender.datetimesubmitted.split('T')[0];
  let estimatedDays = Math.ceil(tender.estimatedTimeHours / 24);
  if (estimatedDays === 0) {
    estimatedDays = 1;
  }

  const getStatusKey = (status: string) => {
    switch (status.toLowerCase()) {
      case "under review":
        return "under_review";
      case "accepted":
        return "accepted";
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      case "submitted":
        return "submitted";
      default:
        return "submitted";
    }
  };

  const statusClass = statusStyles[getStatusKey(tender.status)];

  const handleTenderClick = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const company_name = String(user_data.current?.company_name);
      const rspcontracts = await getCompanyContract(company_name, tender.tender_id, user_session);
      if (rspcontracts == null) {
        setShowDetails(false);
      } else {
        setContract(rspcontracts);
        setShowDetails(true);
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

  const tenderStatus = tender.status.charAt(0).toUpperCase() + tender.status.slice(1);

  return (
    <>
      <div
        className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200 hover:bg-opacity-80 cursor-pointer"
        onClick={handleTenderClick}
      >
        <div className="col-span-1 flex justify-center">
          <span
            className={`py-1 rounded-3xl text-center font-bold ${statusClass}`}
            style={{ minWidth: "150px" }}
          >
            {tenderStatus}
          </span>
        </div>
        <div className="col-span-1 flex justify-center font-bold">{tender.tendernumber}</div>
        <div className="col-span-1 flex justify-center">{tender.ticketnumber}</div>
        <div className="col-span-1 flex justify-center">
          {tender.municipality}
        </div>
        <div className="col-span-1 flex justify-center">{formattedDate}</div>
        <div className="col-span-1 flex justify-center">R{tender.quote.toFixed(2)}</div>
        <div className="col-span-1 flex justify-center">{estimatedDays} days</div>
      </div>

      {showDetails && (
        <TenderMax
          contract_id={contract.contract_id}
          status={contract.status}
          companyname={tender.companyname}
          contractdatetime={contract.contractdatetime}
          finalCost={contract.finalCost}
          finalDuration={contract.finalDuration}
          ticketnumber={tender.ticketnumber}
          longitude={tender.longitude}
          latitude={tender.latitude}
          completedatetime={contract.completedatetime}
          contractnumber={contract.contractnumber}
          municipality={tender.municipality}
          upload={null}
          hasReportedCompletion={false}
          onClose={handleClose}
        />
      )}
    </>
  );
}
