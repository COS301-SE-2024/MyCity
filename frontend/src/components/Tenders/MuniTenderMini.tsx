import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'unassigned' | 'active' | 'closed' | 'rejected';

interface TenderType {
  id: string;
  title: string;
  status: Status;
  assignedTo: string;
  address: string;
  urgency: Urgency;
}

interface UrgencyMappingType {
  [key: string]: { icon: JSX.Element, label: string };
}

const urgencyMapping: UrgencyMappingType = {
  high: { icon: <AlertCircle className="text-red-500" />, label: 'Urgent' },
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: 'Moderate' },
  low: { icon: <AlertCircle className="text-green-500" />, label: 'Not Urgent' }
};

const statusStyles = {
  unassigned: 'border-blue-500 text-blue-500 bg-white',
  active: 'border-green-500 text-black bg-green-200',
  closed: 'border-gray-500 text-black bg-gray-200',
  rejected: 'border-red-500 text-black bg-red-200'
};

export default function Tender({ tender }: { tender: TenderType }) {
  const addressRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const urgency = urgencyMapping[tender.urgency] || urgencyMapping.low;

  useEffect(() => {
    if (addressRef.current) {
      setIsOverflowing(addressRef.current.scrollWidth > addressRef.current.clientWidth);
    }
  }, []);

  return (
    <>
      <div className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200">
        <div className="col-span-1 flex justify-center">{urgency.icon}</div>
        <div className="col-span-1 flex justify-center font-bold">{tender.id}</div>
        <div className="col-span-1 flex justify-center">{tender.title}</div>
        <div className="col-span-1 flex justify-center">
          <span className={`px-2 py-1 rounded border ${statusStyles[tender.status]}`}>
            {tender.status}
          </span>
        </div>
        <div className="col-span-1 flex justify-center">{tender.assignedTo}</div>
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
            {tender.address}
          </div>
        </div>
      </div>
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
