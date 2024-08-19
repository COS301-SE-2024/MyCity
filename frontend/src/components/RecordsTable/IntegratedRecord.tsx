import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import TicketViewMuni from '../TicketViewMuni/TicketViewMuni';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'Fix in progress' | 'Unaddressed';

interface RecordType {
    ticket_id: string;
    ticketnumber: string;
    asset_id: string;
    imageURL: string;
    user_picture: string;
    municipality_picture: string;
    description: string;
    state: string;
    address: string;
    createdby: string;
    viewcount: number;
    commentcount: number;
    latitude: string;
    longitude: string;
    upvotes: number;
    urgency: Urgency;
}

interface UrgencyMappingType {
  [key: string]: { icon: JSX.Element, label: string };
}

interface StatusMappingType {
  [key: string]: string;
}

const statusMapping: StatusMappingType = {
  'In Progress': 'Tender Contract',
  'Assigning Contract': 'Tender Contract',
  'Opened': 'View Tenders'
};

const urgencyMapping: UrgencyMappingType = {
  high: { icon: <AlertCircle className="text-red-500" />, label: 'Urgent' },
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: 'Moderate' },
  low: { icon: <AlertCircle className="text-green-500" />, label: 'Not Urgent' }
};

export default function Record({ record, refresh }: { record: RecordType, refresh: () => void }) {
  const [showTicketView, setShowTicketView] = useState(false);
  const addressRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [ticketstate, setTicketstate] = useState<string>("");

  useEffect(() => {
    setTicketstate(record.state);
  }, [record.state]);

  const handleClick = () => {
    setShowTicketView(true);
  };

  const handleClose = (data: number) => {
    setShowTicketView(false);
    if (data === 1) {
      setTicketstate("In Progress");
    } else if (data === -1) {
      setTicketstate("Taking Tenders");
    }
    else if(data == -2)
    {
      setTicketstate("Closed")
    }
    refresh();
  };

  const getUrgency = (votes: number) => {
    if (votes < 10) {
      return "low";
    } else if (votes >= 10 && votes < 20) {
      return "medium";
    } else if (votes >= 20 && votes <= 40) {
      return "high";
    } else {
      return "low"; // Default case
    }
  };

  function getStateColour(state: string) {
    switch (state) {
      case "Opened":
        return "bg-green-200 text-black";
      case "In Progress":
      case "Assigning Contract":
        return "bg-blue-200 text-black";
      case "Closed":
        return "bg-red-200 text-black";
      case "Taking Tenders":
        return "bg-purple-200 text-black";
      default:
        return "bg-gray-200 text-black";
    }
  }
  
  
  const truncateAddress = (address: string) => {
    return address.split(',')[0];
  };

  const urgency = urgencyMapping[getUrgency(record.upvotes)] || urgencyMapping.low;

  useEffect(() => {
    if (addressRef.current) {
      setIsOverflowing(addressRef.current.scrollWidth > addressRef.current.clientWidth);
    }
  }, []);

  return (
    <>
      <div
        className="grid grid-cols-6 gap-4 items-center mt-2 px-2 py-1 rounded-3xl bg-white bg-opacity-70 text-black border-b z-50 border-gray-200 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleClick}
        
      >
        <div className="col-span-1 flex justify-center">{urgency.icon}</div>
        <div className="col-span-1 flex justify-center font-bold">{record.ticketnumber}</div>
        <div className="col-span-1 flex justify-center">{record.asset_id}</div>
        <div className="col-span-1 flex justify-center">
          <span 
            className={`py-1 rounded-3xl text-center font-bold ${getStateColour(ticketstate)}`} 
            style={{ minWidth: '150px' }} // Normalizing dimensions based on 'Taking Tenders'
          >
            {ticketstate}
          </span>
        </div>
        <div className="col-span-1 flex justify-center">{record.createdby}</div>
        <div
          className="col-span-1 flex justify-center truncate overflow-hidden whitespace-nowrap"
          ref={addressRef}
        >
          <div
            style={{
              display: "inline-block",
              animation: isOverflowing ? "scroll 10s linear infinite" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {truncateAddress(record.address)}
          </div>
        </div>
      </div>
      {showTicketView && (
        <TicketViewMuni
          show={showTicketView}
          onClose={handleClose}
          title={record.asset_id}
          address={truncateAddress(record.address)}
          arrowCount={record.upvotes}
          commentCount={record.commentcount}
          viewCount={record.viewcount}
          ticketNumber={record.ticketnumber}
          description={record.description}
          user_picture={record.user_picture}
          createdBy={record.createdby}
          imageURL={record.imageURL}
          status={record.state}
          municipalityImage={record.municipality_picture}
          upvotes={record.upvotes}
          latitude={record.latitude}
          longitude={record.longitude}
          urgency={record.urgency}
          ticket_id={record.ticket_id}
        />
      )}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
  
}

