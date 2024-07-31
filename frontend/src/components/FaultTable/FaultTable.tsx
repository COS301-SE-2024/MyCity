import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import DashboardFaultCardUserView from "@/components/FaultCardUserView/DashboardFaultCardUserView";
import { AlertCircle } from "lucide-react";

interface Incident {
  ticket_id : string
  ticketnumber: string;
  asset_id: string;
  upvotes: number;
  viewcount: number;
  commentcount: number;
  address: string;
  description: string;
  user_picture: string;
  username: string;
  state: string;
  imageURL : string;
  municipality_picture: string;
  createdby : string;
  urgency: "high" | "medium" | "low"; // Added urgency field
}

interface IncidentProps{
  tableitems : Incident[]
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

const IncidentTable : React.FC<IncidentProps> = ({ tableitems = [] }) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isOverflowing, setIsOverflowing] = useState<{ [key: number]: boolean }>({});
  const addressRefs = useRef<(HTMLDivElement | null)[]>([]);

  const incidents: Incident[] = [
    
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

  const getUrgency = (votes : number) =>{
      if (votes < 10) {
        return "low";
    } else if (votes >= 10 && votes < 20) {
        return "medium";
    } else if (votes >= 20 && votes <= 40) {
        return "high";
    } else {
        return "low"; // Default case
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Opened':
        return 'bg-red-200 text-red-800';
      case 'In Progress':
        return 'bg-blue-200 text-blue-800';
      case 'Taking Tenders':
        return 'bg-blue-200 text-blue-800';
      case 'Assigning Contract':
        return 'bg-blue-200 text-blue-800';
      case 'Closed':
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
      {tableitems.map((incident, index) => (
        
        <div
          key={index}
          className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer transform transition-colors duration-300 hover:bg-gray-200"
          onClick={() => handleRowClick(incident)}
        >
          <div className="col-span-1 flex justify-center">
            {  
            urgencyMapping[getUrgency(incident.upvotes)].icon}
          </div>
          <div className="col-span-1 flex justify-center font-bold">
            {incident.ticketnumber}
          </div>
          <div className="col-span-1 flex justify-center">
            {incident.asset_id}
          </div>
          <div className="col-span-1 flex justify-center">
            <span className={`px-2 py-1 rounded ${getStatusColor(incident.state)}`}>
              {incident.state}
            </span>
          </div>
          <div className="col-span-1 flex justify-center text-center">
            <div className="flex flex-col items-center">
              <div>
                <FaArrowUp />
              </div>
              <div>{incident.upvotes}</div>
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
          title={selectedIncident.asset_id}
          address={selectedIncident.address}
          arrowCount={selectedIncident.upvotes}
          commentCount={selectedIncident.commentcount}
          viewCount={selectedIncident.viewcount}
          ticketNumber={selectedIncident.ticketnumber}
          description={selectedIncident.description}
          image={selectedIncident.imageURL}
          createdBy={selectedIncident.createdby}
          status={selectedIncident.state}
          municipalityImage={selectedIncident.municipality_picture} // Pass municipality image
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
