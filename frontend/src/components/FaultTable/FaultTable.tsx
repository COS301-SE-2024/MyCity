import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import DashboardFaultCardUserView from "@/components/FaultCardUserView/DashboardFaultCardUserView";
import { AlertCircle } from "lucide-react";

interface Incident {
  ticketNumber: string;
  faultType: string;
  engagement: {
    upvotes: number;
    shares: number;
    comments: number;
  };
  address: string;
  description: string;
  image: string;
  createdBy: string;
  status: string;
  municipalityImage: string;
  urgency: "high" | "medium" | "low"; // Added urgency field
}

const urgencyMapping = {
  high: { icon: <AlertCircle className="text-red-500" />, label: "Urgent" },
  medium: {
    icon: <AlertCircle className="text-yellow-500" />,
    label: "Moderate",
  },
  low: {
    icon: <AlertCircle className="text-green-500" />,
    label: "Not Urgent",
  },
};

const IncidentTable = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isOverflowing, setIsOverflowing] = useState<{ [key: number]: boolean }>({});
  const addressRefs = useRef<(HTMLDivElement | null)[]>([]);

  const incidents: Incident[] = [
    {
      ticketNumber: "SA0245",
      faultType: "Leaking Sewerage",
      engagement: {
        upvotes: 21.6,
        shares: 10.3,
        comments: 829,
      },
      address: "392 Rupert Street, Bucky's Ridge",
      description: "Sewage leakage causing significant disruption.",
      createdBy: "John Doe",
      image: "https://via.placeholder.com/150", // Mock image URL
      status: "Unaddressed",
      municipalityImage: "https://via.placeholder.com/50", // Mock municipality image URL
      urgency: "high", // Added urgency value
    },
    {
      ticketNumber: "SA0246",
      faultType: "Fire",
      engagement: {
        upvotes: 17.6,
        shares: 8.4,
        comments: 657,
      },
      address: "231 Barker Street, Bucky's Ridge",
      description: "Fire hazard reported near residential area.",
      createdBy: "Jane Smith",
      image: "https://via.placeholder.com/150", // Mock image URL
      status: "In Progress",
      municipalityImage: "https://via.placeholder.com/50", // Mock municipality image URL
      urgency: "medium", // Added urgency value
    },
    {
      ticketNumber: "SA0247",
      faultType: "Mass Psychosis",
      engagement: {
        upvotes: 12.9,
        shares: 6.3,
        comments: 459,
      },
      address: "8 Happy Street, Bucky's Ridge",
      description: "Unusual behavior observed in large groups.",
      createdBy: "Alice Johnson",
      image: "https://via.placeholder.com/150", // Mock image URL
      status: "Resolved",
      municipalityImage: "https://via.placeholder.com/50", // Mock municipality image URL
      urgency: "low", // Added urgency value
    },
    {
      ticketNumber: "SA0248",
      faultType: "Leaking Sewerage",
      engagement: {
        upvotes: 10.2,
        shares: 2.7,
        comments: 153,
      },
      address: "392 Rupert Street, Bucky's Ridge",
      description: "Recurring sewage leakage issue.",
      createdBy: "Bob Lee",
      image: "https://via.placeholder.com/150", // Mock image URL
      status: "Unaddressed",
      municipalityImage: "https://via.placeholder.com/50", // Mock municipality image URL
      urgency: "high", // Added urgency value
    },
  ];

  useEffect(() => {
    const overflowState: { [key: number]: boolean } = {};
    addressRefs.current.forEach((ref, index) => {
      if (ref) {
        overflowState[index] = ref.scrollWidth > ref.clientWidth;
      }
    });
    setIsOverflowing(overflowState);
  }, [addressRefs]);

  const handleRowClick = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleClose = () => {
    setSelectedIncident(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unaddressed':
        return 'bg-red-200 text-red-800';
      case 'In Progress':
        return 'bg-blue-200 text-blue-800';
      case 'Resolved':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="text-white text-opacity-80 p-10">
      <div className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 text-white text-opacity-80 font-bold border-b border-gray-200">
        <div className="col-span-1 flex justify-center">Urgency</div>
        <div className="col-span-1 flex justify-center">Ticket Number</div>
        <div className="col-span-1 flex justify-center">Fault Type</div>
        <div className="col-span-1 flex justify-center">Status</div>
        <div className="col-span-1 flex justify-center">Upvotes</div>
        <div className="col-span-1 flex justify-center">Address</div>
      </div>
      {incidents.map((incident, index) => (
        <div
          key={index}
          className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer transform transition-colors duration-300 hover:bg-gray-200"
          onClick={() => handleRowClick(incident)}
        >
          <div className="col-span-1 flex justify-center">
            {urgencyMapping[incident.urgency].icon}
          </div>
          <div className="col-span-1 flex justify-center font-bold">
            {incident.ticketNumber}
          </div>
          <div className="col-span-1 flex justify-center">
            {incident.faultType}
          </div>
          <div className="col-span-1 flex justify-center">
            <span className={`px-2 py-1 rounded ${getStatusColor(incident.status)}`}>
              {incident.status}
            </span>
          </div>
          <div className="col-span-1 flex justify-center text-center">
            <div className="flex flex-col items-center">
              <div>
                <FaArrowUp />
              </div>
              <div>{incident.engagement.upvotes}k</div>
            </div>
          </div>
          <div className="col-span-1 flex justify-center overflow-hidden whitespace-nowrap" ref={(el) => { addressRefs.current[index] = el; }}>
            <div
              style={{
                display: "inline-block",
                animation: isOverflowing[index] ? "scroll 10s linear infinite" : "none",
                animationTimingFunction: "linear",
                animationDelay: "5s",
                whiteSpace: "nowrap",
              }}
            >
              {incident.address}
            </div>
          </div>
        </div>
      ))}
      {selectedIncident && (
        <DashboardFaultCardUserView
          show={!!selectedIncident}
          onClose={handleClose}
          title={selectedIncident.faultType}
          address={selectedIncident.address}
          arrowCount={selectedIncident.engagement.upvotes}
          commentCount={selectedIncident.engagement.comments}
          viewCount={selectedIncident.engagement.shares}
          ticketNumber={selectedIncident.ticketNumber}
          description={selectedIncident.description}
          image={selectedIncident.image}
          createdBy={selectedIncident.createdBy}
          status={selectedIncident.status}
          municipalityImage={selectedIncident.municipalityImage} // Pass municipality image
          urgency={selectedIncident.urgency} // Pass urgency
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
    </div>
  );
};

export default IncidentTable;



//Previous version of this in development

/*import React from 'react';
import { FaArrowUp, FaEye, FaCommentAlt } from 'react-icons/fa';

interface IncidentItems{
  asset_id : string,
  ticketnumber : string,
  address : string,
  upvotes : number,
  commentcount : number,
  viewcount : number,
}

interface IncidentItemsProps {
  tableitems: IncidentItems[];
}

const IncidentTable: React.FC<IncidentItemsProps> = ({tableitems}: IncidentItemsProps) => {
  

  return (
    <div className="text-white text-opacity-80 p-4">
      <div className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-lg text-white text-opacity-80 font-bold">
        <div className="col-span-1 flex justify-center">Urgency</div>
        <div className="col-span-1 flex justify-center">Ticket Number</div>
        <div className="col-span-1 flex justify-center">Fault Type</div>
        <div className="col-span-1 flex justify-center">Engagement</div>
        <div className="col-span-1 flex justify-center">Address</div>
      </div>
      {tableitems.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200"
        >
          <div className="col-span-1 flex justify-center text-red-500 font-bold">!</div>
          <div className="col-span-1 flex justify-center font-bold">{item.ticketnumber}</div>
          <div className="col-span-1 flex justify-center">{item.asset_id}</div>
          <div className="col-span-1 flex justify-center text-center">
            <div className="flex flex-col items-center">
              <div><FaArrowUp /></div>
              <div>{item.upvotes}k</div>
            </div>
            <div className="flex flex-col items-center ml-4">
              <div><FaEye /></div>
              <div>{item.viewcount}k</div>
            </div>
            <div className="flex flex-col items-center ml-4">
              <div><FaCommentAlt /></div>
              <div>{item.commentcount}</div>
            </div>
          </div>
 
          <div className="col-span-1 flex justify-center truncate">{item.address}</div>
        </div>
      ))}
    </div>
  );
  
};

export default IncidentTable;
*/
