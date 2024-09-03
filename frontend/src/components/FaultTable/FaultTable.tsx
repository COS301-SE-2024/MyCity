import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";
import { AlertCircle } from "lucide-react";

interface Incident {
  ticket_id: string;
  ticketnumber: string;
  asset_id: string;
  upvotes: number;
  viewcount: number;
  commentcount: number;
  address: string;
  description: string;
  username: string;
  imageURL: string;
  createdby: string;
  latitude: number;
  longitude: number;
  municipality_id: string;
  state: string;
  urgency: "high" | "medium" | "low";
}

interface IncidentProps {
  tableitems: Incident[];
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

const IncidentTable: React.FC<IncidentProps> = ({ tableitems = [] }) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState<{
    [key: number]: boolean;
  }>({});
  const addressRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const overflowState: { [key: number]: boolean } = {};
    addressRefs.current.forEach((ref, index) => {
      if (ref) {
        overflowState[index] = ref.scrollWidth > ref.clientWidth;
      }
    });
    setIsOverflowing(overflowState);
  }, [addressRefs]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleRowClick = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleClose = () => {
    setSelectedIncident(null);
  };

  const getUrgency = (votes: number) => {
    if (votes < 10) return "low";
    if (votes >= 10 && votes < 20) return "medium";
    if (votes >= 20 && votes <= 40) return "high";
    return "low";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const truncateAddress = (address: string) => {
    const [firstPart] = address.split(",");
    return firstPart.length > 20 ? `${firstPart.slice(0, 20)}...` : firstPart;
  };

  return (
    <div className="text-white text-opacity-80 p-5 sm:p-10">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#ADD8E6"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden sm:block h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 text-white text-opacity-80 font-bold border-b border-gray-200">
              <div className="col-span-1 flex justify-center">Urgency</div>
              <div className="col-span-1 flex justify-center">
                Ticket Number
              </div>
              <div className="col-span-1 flex justify-center">Fault Type</div>
              <div className="col-span-1 flex justify-center">Upvotes</div>
              <div className="col-span-1 flex justify-center">Address</div>
            </div>
            {tableitems.map((incident, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer transform transition-colors duration-300 hover:bg-gray-200"
                onClick={() => handleRowClick(incident)}
              >
                <div className="col-span-1 flex justify-center">
                  {urgencyMapping[getUrgency(incident.upvotes)].icon}
                </div>
                <div className="col-span-1 flex justify-center font-bold">
                  {incident.ticketnumber}
                </div>
                <div className="col-span-1 flex justify-center">
                  {incident.asset_id}
                </div>
                <div className="col-span-1 flex justify-center text-center">
                  <div className="flex flex-col items-center">
                    <FaArrowUp />
                    <div>{formatNumber(incident.upvotes)}</div>
                  </div>
                </div>
                <div
                  className="col-span-1 flex justify-center overflow-hidden whitespace-nowrap"
                  ref={(el) => {
                    addressRefs.current[index] = el;
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {truncateAddress(incident.address)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="block sm:hidden h-[80vh] overflow-y-auto">
            {tableitems.map((incident, index) => (
              <div
                key={index}
                className="p-4 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer transform transition-colors duration-300 hover:bg-gray-200 mb-2"
                onClick={() => handleRowClick(incident)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>{urgencyMapping[getUrgency(incident.upvotes)].icon}</div>
                  <div className="font-bold">{incident.ticketnumber}</div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div>{incident.asset_id}</div>
                  <div className="flex items-center">
                    <FaArrowUp className="mr-1" />
                    {formatNumber(incident.upvotes)}
                  </div>
                </div>
                <div
                  className="overflow-hidden whitespace-nowrap"
                  ref={(el) => {
                    addressRefs.current[index] = el;
                  }}
                >
                  {truncateAddress(incident.address)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {selectedIncident && (
        <FaultCardUserView
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
          urgency={selectedIncident.urgency}
          longitude={selectedIncident.longitude}
          latitude={selectedIncident.latitude}
          ticketId={selectedIncident.ticket_id}
          state={selectedIncident.state}
          municipality_id={selectedIncident.municipality_id}
        />
      )}
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
