import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import TicketViewCompany from '../TicketViewCompany/TicketViewCompany'; // Replacing TicketViewMuni with TicketViewCompany

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
  [key: string]: { icon: JSX.Element; label: string };
}

interface StatusMappingType {
  [key: string]: string;
}

const statusMapping: StatusMappingType = {
  'In Progress': 'Tender Contract',
  'Assigning Contract': 'Tender Contract',
  'Opened': 'View Tenders',
};

const statusStyles = {
  Opened: 'text-green-500 bg-green-200 rounded-full',
  In_Progress: 'text-blue-500 bg-blue-200 rounded-full',
  Assigning_Contract: 'text-blue-500 bg-blue-200 rounded-full',
  Closed: 'text-red-500 bg-red-200 rounded-full',
  Taking_Tenders: 'text-purple-500 bg-purple-200 rounded-full', // Added purple for Taking Tenders
};

const urgencyMapping: UrgencyMappingType = {
  high: { icon: <AlertCircle className="text-red-500" />, label: 'Urgent' },
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: 'Moderate' },
  low: { icon: <AlertCircle className="text-green-500" />, label: 'Not Urgent' },
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

  const getUrgency = (votes: number) => {
    if (votes < 10) {
      return 'low';
    } else if (votes >= 10 && votes < 20) {
      return 'medium';
    } else if (votes >= 20 && votes <= 40) {
      return 'high';
    } else {
      return 'low'; // Default case
    }
  };

  const getStatus = (state: string) => {
    switch (state) {
      case 'Closed':
        return 'Closed';
      case 'Opened':
        return 'Opened';
      case 'In Progress':
        return 'In_Progress';
      case 'Assigning Contract':
        return 'Assigning_Contract';
      case 'Taking Tenders': // Added check for Taking Tenders
        return 'Taking_Tenders';
      default:
        return 'Closed';
    }
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
      <div className="hidden sm:block text-black">
        <div
          className="grid grid-cols-6 gap-4 text-black items-center mb-2 px-4 py-2 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer hover:bg-opacity-80 transition-colors"
          onClick={handleClick}
        >
          <div className="col-span-1 flex justify-center">{urgency.icon}</div>
          <div className="col-span-1 flex justify-center font-bold">{record.ticketnumber}</div>
          <div className="col-span-1 flex justify-center">{record.asset_id}</div>
          <div className="col-span-1 flex justify-center">
            <span className={`px-2 py-1 rounded ${statusStyles[getStatus(record.state)]}`}>
              {record.state}
            </span>
          </div>
          <div className="col-span-1 flex justify-center">{record.createdby}</div>
          <div className="col-span-1 flex justify-center truncate overflow-hidden">
            {record.address}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          className="grid grid-cols-2 gap-4 items-center mb-2 px-4 py-2 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer hover:bg-opacity-80 transition-colors"
          onClick={handleClick}
        >
          {/* Column 1 - Urgency & Ticket Number */}
          <div className="col-span-1 flex flex-col justify-center items-center text-center">
            <div>{urgency.icon}</div>
            <div className="font-bold text-lg">{record.ticketnumber}</div>
          </div>

          {/* Column 2 - Status and Other Details */}
          <div className="col-span-1 flex flex-col space-y-1">
            {/* Status at the top without label */}
            <div className="text-sm">
              <span className={`px-2 py-1 rounded ${statusStyles[getStatus(record.state)]}`}>
                {record.state}
              </span>
            </div>
            <div className="text-sm">
              <strong>Asset:</strong> {record.asset_id}
            </div>
            <div className="text-sm">
              <strong>Created By:</strong> {record.createdby}
            </div>
            <div className="text-sm truncate">
              <strong>Address:</strong> {record.address}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket View - Same for both desktop and mobile */}
      {showTicketView && (
        <TicketViewCompany
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
