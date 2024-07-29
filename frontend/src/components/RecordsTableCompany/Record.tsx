import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import TicketViewCompany from '../TicketViewCompany/TicketViewCompany';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'Fix in progress' | 'Unaddressed';

interface RecordType {
  id: string;
  faultType: string;
  status: Status;
  createdBy: string;
  address: string;
  urgency: Urgency;
  municipality: string;
  hasBidded: boolean;
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

  const urgency = urgencyMapping[record.urgency] || urgencyMapping.low;

  useEffect(() => {
    if (addressRef.current) {
      setIsOverflowing(addressRef.current.scrollWidth > addressRef.current.clientWidth);
    }
  }, []);

  return (
    <>
      <div
        className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleClick}
      >
        <div className="col-span-1 flex justify-center">{urgency.icon}</div>
        <div className="col-span-1 flex justify-center font-bold">{record.id}</div>
        <div className="col-span-1 flex justify-center">{record.faultType}</div>
        <div className="col-span-1 flex justify-center">
          <span className={`px-2 py-1 rounded ${record.status === 'Unaddressed' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
            {record.status}
          </span>
        </div>
        <div className="col-span-1 flex justify-center">{record.createdBy}</div>
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
        <div className="col-span-1 flex justify-center">{record.municipality}</div>
      </div>
      {showTicketView && (
        <TicketViewCompany
          show={showTicketView}
          onClose={handleClose}
          title={record.faultType}
          address={record.address}
          ticketNumber={record.id}
          description={"Add the description here"} // Update this as per your data source
          image={"https://via.placeholder.com/150"} // Update this as per your data source
          createdBy={record.createdBy}
          status={record.status}
          municipalityImage={"https://via.placeholder.com/50"} // Update this as per your data source
          urgency={record.urgency} // Pass urgency to TicketViewCompany
          municipality={record.municipality} // Pass municipality to TicketViewCompany
          hasBidded={record.hasBidded} // Pass hasBidded to TicketViewCompany
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
