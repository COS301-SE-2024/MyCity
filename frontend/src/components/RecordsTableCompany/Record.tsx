import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import TicketViewCompany from '../TicketViewCompany/TicketViewCompany';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'Fix in progress' | 'Unaddressed';

interface RecordType {
  ticket_id: string;
    ticketnumber : string;
    asset_id: string;
    imageURL : string;
    user_picture : string;
    municipality_picture : string ;
    description : string;
    state: string;
    address: string;
    createdby: string;
    viewcount : number;
    commentcount: number;
    latitude : string;
    longitude : string;
    upvotes : number;
    urgency: Urgency;
}

interface UrgencyMappingType {
  [key: string]: { icon: JSX.Element, label: string };
}

interface StatusMappingType {
  [key: string]: string;
}

const statusMapping: StatusMappingType = {
  'Fix in progress': 'Tender Contract',
  'Unaddressed': 'View Tenders'
};

const urgencyMapping: UrgencyMappingType = {
  high: { icon: <AlertCircle className="text-red-500" />, label: 'Urgent' },
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: 'Moderate' },
  low: { icon: <AlertCircle className="text-green-500" />, label: 'Not Urgent' }
};

export default function Record({ record }: { record: RecordType }) {
  const [showTicketView, setShowTicketView] = useState(false);
  const addressRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const handleClick = () => {
    setShowTicketView(true);
  };

  const handleClose = () => {
    setShowTicketView(false);
  };

  const getUrgency = (votes : number) =>{
        if (votes < 5) {
        return "low";
    } else if (votes >= 5 && votes < 10) {
        return "medium";
    } else if (votes >= 10 && votes <= 40) {
        return "high";
    } else {
        return "low"; // Default case
    }
  }

  const urgency = urgencyMapping[getUrgency(record.upvotes)] || urgencyMapping.low;

  useEffect(() => {
    if (addressRef.current) {
      setIsOverflowing(addressRef.current.scrollWidth > addressRef.current.clientWidth);
    }
  }, []);

  return (
    <>
      <div
        className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleClick}
      >
        <div className="col-span-1 flex justify-center">{urgency.icon}</div>
        <div className="col-span-1 flex justify-center font-bold">{record.ticketnumber}</div>
        <div className="col-span-1 flex justify-center">{record.asset_id}</div>
        <div className="col-span-1 flex justify-center">
          <span className={`px-2 py-1 rounded ${record.state === 'Unaddressed' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
            {record.state}
          </span>
        </div>
        <div className="col-span-1 flex justify-center">{record.createdby}</div>
        <div className="col-span-1 flex justify-center truncate overflow-hidden whitespace-nowrap" ref={addressRef}>
          <div
            style={{
              display: "inline-block",
              animation: isOverflowing ? "scroll 10s linear infinite" : "none",
              animationTimingFunction: "linear",
              animationDelay: "5s",
              whiteSpace: "nowrap",
            }}
          >
            {record.address}
          </div>
        </div>
      </div>
      {showTicketView && (
        <TicketViewCompany
        show={showTicketView}
        onClose={handleClose}
        title={record.asset_id}
        address={record.address}
        arrowCount={record.upvotes}  // Update this as per your data source
        commentCount={record.commentcount} // Update this as per your data source
        viewCount={record.viewcount} // Update this as per your data source
        ticketNumber={record.ticketnumber}
        description={record.description} // Update this as per your data source
        user_picture={record.user_picture} // Update this as per your data source
        createdBy={record.createdby}
        imageURL={record.imageURL}
        status={record.state}
        municipalityImage={record.municipality_picture} // Update this as per your data source
        upvotes={record.upvotes}
        latitude={record.latitude}
        longitude={record.longitude}
        urgency={record.urgency} // Pass urgency to TicketViewMuni
        ticket_id={record.ticket_id} // Pass municipality to TicketViewCompany
        />
      )}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(20%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-20%);
          }
        }
      `}</style>
    </>
  );
}
