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

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    setShowTicketView(true);
  };
  
  const handleClose = (data: number) => {
    setShowTicketView(false);
    if (data === 1) {
      setTicketstate("In Progress");
    } else if (data === -1) {
      setTicketstate("Taking Tenders");
    } else if (data === -2) {
      setTicketstate("Closed");
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

  const truncateAddress = (address: string, maxLength: number) => {
    if (address.length <= maxLength) return address;
  
    // Truncate the string at the nearest word boundary within maxLength
    const truncated = address.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
  
    // If a space was found, truncate at the last space, otherwise truncate at maxLength
    return lastSpace > 0
      ? address.slice(0, lastSpace) + "..." // Keep the beginning, truncate the end
      : address.slice(0, maxLength) + "..."; // Truncate the end without cutting off the start
  };
  

  const urgency = urgencyMapping[getUrgency(record.upvotes)] || urgencyMapping.low;

  useEffect(() => {
    if (addressRef.current) {
      setIsOverflowing(addressRef.current.scrollWidth > addressRef.current.clientWidth);
    }
  }, []);

  return (
    <>
      {/* Desktop View */}
      <div
        className="hidden sm:grid grid-cols-6 gap-4 items-center mt-2 px-2 py-1 rounded-3xl bg-white bg-opacity-70 text-black border-b z-50 border-gray-200 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleClick}
      >
        <div className="col-span-1 flex justify-center">{urgency.icon}</div>
        <div className="col-span-1 flex justify-center font-bold">{record.ticketnumber}</div>
        <div className="col-span-1 flex text-center justify-center">{record.asset_id}</div>
        <div className="col-span-1 flex justify-center">
          <span 
            className={`py-1 rounded-3xl text-center font-bold ${getStateColour(ticketstate)}`} 
            style={{ minWidth: '150px' }}
          >
            {ticketstate}
          </span>
        </div>
        <div className="col-span-1 flex justify-center">{record.createdby}</div>
        <div
        className="col-span-1 flex justify-center truncate overflow-hidden whitespace-nowrap"
        ref={addressRef}
      >
        {isOverflowing
          ? truncateAddress(record.address, 30)  // Truncate if the address is too long
          : record.address}  {/* Display full address if it fits */}
      </div>
      </div>

      {/* Mobile View */}
      <div
        className="block sm:hidden bg-white bg-opacity-70 text-black rounded-lg p-4 mb-4 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleClick}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg">{record.ticketnumber}</span>
          <span className={`py-1 px-3 rounded-full text-center font-bold ${getStateColour(ticketstate)}`}>
            {ticketstate}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Urgency:</span>
          {urgency.icon}
        </div>
        <div className="mt-2">
          <span className="text-gray-500">Asset ID: </span>
          <span>{record.asset_id}</span>
        </div>
        <div className="mt-2">
          <span className="text-gray-500">Created By: </span>
          <span>{record.createdby}</span>
        </div>
        <div className="mt-2">
          <span className="text-gray-500">Address: </span>
          <span>{truncateAddress(record.address, 30)}</span>
        </div>
      </div>

      {showTicketView && (
        <TicketViewMuni
          show={showTicketView}
          onClose={handleClose}
          title={record.asset_id}
          address={record.address}
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
    </>
  );
}
