import React, { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import DashboardFaultCardUserView from '@/components/FaultCardUserView/DashboardFaultCardUserView';

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
}

const IncidentTable = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const incidents = [
    {
      ticketNumber: 'SA0245',
      faultType: 'Leaking Sewerage',
      engagement: {
        upvotes: 21.6,
        shares: 10.3,
        comments: 829,
      },
      address: '392 Rupert Street, Bucky\'s Ridge...',
      description: 'Sewage leakage causing significant disruption.',
      createdBy: 'John Doe',
      image: 'https://via.placeholder.com/150', // Mock image URL
      status: 'Unaddressed',
      municipalityImage: 'https://via.placeholder.com/50', // Mock municipality image URL
    },
    {
      ticketNumber: 'SA0246',
      faultType: 'Fire',
      engagement: {
        upvotes: 17.6,
        shares: 8.4,
        comments: 657,
      },
      address: '231 Barker Street, Bucky\'s Ridge...',
      description: 'Fire hazard reported near residential area.',
      createdBy: 'Jane Smith',
      image: 'https://via.placeholder.com/150', // Mock image URL
      status: 'In Progress',
      municipalityImage: 'https://via.placeholder.com/50', // Mock municipality image URL
    },
    {
      ticketNumber: 'SA0247',
      faultType: 'Mass Psychosis',
      engagement: {
        upvotes: 12.9,
        shares: 6.3,
        comments: 459,
      },
      address: '8 Happy Street, Bucky\'s Ridge...',
      description: 'Unusual behavior observed in large groups.',
      createdBy: 'Alice Johnson',
      image: 'https://via.placeholder.com/150', // Mock image URL
      status: 'Resolved',
      municipalityImage: 'https://via.placeholder.com/50', // Mock municipality image URL
    },
    {
      ticketNumber: 'SA0248',
      faultType: 'Leaking Sewerage',
      engagement: {
        upvotes: 10.2,
        shares: 2.7,
        comments: 153,
      },
      address: '392 Rupert Street, Bucky\'s Ridge',
      description: 'Recurring sewage leakage issue.',
      createdBy: 'Bob Lee',
      image: 'https://via.placeholder.com/150', // Mock image URL
      status: 'Unaddressed',
      municipalityImage: 'https://via.placeholder.com/50', // Mock municipality image URL
    },
  ];

  const handleRowClick = (incident : any) => {
    setSelectedIncident(incident);
  };

  const handleClose = () => {
    setSelectedIncident(null);
  };

  return (
    <div className="text-white text-opacity-80 p-10">
      <div className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 text-white text-opacity-80 font-bold border-b border-gray-200">
        <div className="col-span-1 flex justify-center">Ticket Number</div>
        <div className="col-span-1 flex justify-center">Fault Type</div>
        <div className="col-span-1 flex justify-center">Status</div>
        <div className="col-span-1 flex justify-center">Upvotes</div>
        <div className="col-span-1 flex justify-center">Address</div>
      </div>
      {tableitems.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer transform transition-colors duration-300 hover:bg-gray-200"
          onClick={() => handleRowClick(incident)}
        >
          <div className="col-span-1 flex justify-center font-bold">{incident.ticketNumber}</div>
          <div className="col-span-1 flex justify-center">{incident.faultType}</div>
          <div className="col-span-1 flex justify-center">{incident.status}</div>
          <div className="col-span-1 flex justify-center text-center">
            <div className="flex flex-col items-center">
              <div><FaArrowUp /></div>
              <div>{incident.engagement.upvotes}k</div>
            </div>
          </div>
          <div className="col-span-1 flex justify-center truncate">{incident.address}</div>
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
        />
      )}
    </div>
  );
};

export default IncidentTable;

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