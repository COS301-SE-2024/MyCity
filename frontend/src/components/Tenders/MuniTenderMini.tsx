import React, { useEffect, useState } from "react";
import TenderMax from "./MuniTenderMax"; // Assuming the detailed view component is in the same directory
import TenderContainer from "./TendersTemplate";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  tender_id: string;
  tendernumber: string;
  company_id: string;
  companyname: string;
  datetimesubmitted: string;
  ticket_id: string;
  ticketnumber: string;
  status: string;
  quote: number;
  estimatedTimeHours: number;
  longitude: string;
  latitude: string;
  upload: File | null;
  hasReportedCompletion: boolean;
}

function statusStyles(status: String) {
  switch (status) {
    case "completed":
      return "bg-purple-200 text-purple-500 border-purple-200";
    case "approved":
      return "bg-green-200 text-green-500 ";
    case "accepted":
      return "bg-green-200 text-green-500 border-green-200";
    case "under review":
      return "border-blue-200 text-blue-500 bg-blue-200";
    case "submitted":
      return "bg-gray-200 text-gray border-gray-200";
    case "rejected":
      return "bg-red-200 text-red";
  }
}

export default function Tender({
  tender,
  onClose,
}: {
  tender: TenderType;
  onClose: (data: number) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState<String>("");

  const datesubmitted = tender.datetimesubmitted.split("T")[0];

  useEffect(() => {
    setStatus(tender.status);
  }, [tender.status]);

  const handleTenderClick = () => {
    setShowDetails(true);
  };

  const handleClose = async (data: number) => {
    setShowDetails(false);
    if (data !== undefined) {
      switch (data) {
        case 1:
          setStatus("approved");
          onClose(1);
          break;
        case 2:
          setStatus("rejected");
          onClose(0);
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
        className="grid grid-cols-6 gap-4 items-center mb-2 rounded-3xl py-1 text-black bg-white bg-opacity-80 hover:bg-gray-100 cursor-pointer transition duration-200"
        onClick={handleTenderClick}
        style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="col-span-1 flex justify-center">
          <span
            className={`px-2 py-1 rounded-full border ${statusStyles(status)}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="col-span-1 flex justify-center font-bold">
          {tender.tendernumber}
        </div>
        <div className="col-span-1 flex justify-center">
          {tender.companyname}
        </div>
        <div className="col-span-1 flex justify-center">{datesubmitted}</div>
        <div className="col-span-1 flex justify-center">
          R{tender.quote.toFixed(2)}
        </div>
        <div className="col-span-1 flex justify-center">
          {getDays(tender.estimatedTimeHours)} days
        </div>
      </div>
      {showDetails && <TenderContainer tender={tender} onClose={handleClose} />}
    </>
  );
}
