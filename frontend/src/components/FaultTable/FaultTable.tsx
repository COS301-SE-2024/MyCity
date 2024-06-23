import React from 'react';
import { FaArrowUp, FaEye, FaCommentAlt } from 'react-icons/fa';


const IncidentTable = () => {
  const incidents = [
    {
      ticketNumber: 'SA0245',
      faultType: 'Leaking Sewerage',
      engagement: {
        views: 21.6,
        shares: 10.3,
        comments: 829,
      },
      address: '392 Rupert Street, Bucky\'s Ridge...',
    },
    {
      ticketNumber: 'SA0246',
      faultType: 'Fire',
      engagement: {
        views: 17.6,
        shares: 8.4,
        comments: 657,
      },
      address: '231 Barker Street, Bucky\'s Ridge...',
    },
    {
      ticketNumber: 'SA0247',
      faultType: 'Mass Psychosis',
      engagement: {
        views: 12.9,
        shares: 6.3,
        comments: 459,
      },
      address: '8 Happy Street, Bucky\'s Ridge...',
    },
    {
      ticketNumber: 'SA0248',
      faultType: 'Leaking Sewerage',
      engagement: {
        views: 10.2,
        shares: 2.7,
        comments: 153,
      },
      address: '392 Rupert Street, Bucky\'s Ridge',
    },
  ];

  return (
    <div className="text-white text-opacity-80 p-4">
      <div className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-lg text-white text-opacity-80 font-bold">
        <div className="col-span-1 flex justify-center">Urgency</div>
        <div className="col-span-1 flex justify-center">Ticket Number</div>
        <div className="col-span-1 flex justify-center">Fault Type</div>
        <div className="col-span-1 flex justify-center">Engagement</div>
        <div className="col-span-1 flex justify-center">Address</div>
      </div>
      {incidents.map((incident, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200"
        >
          <div className="col-span-1 flex justify-center text-red-500 font-bold">!</div>
          <div className="col-span-1 flex justify-center font-bold">{incident.ticketNumber}</div>
          <div className="col-span-1 flex justify-center">{incident.faultType}</div>
          <div className="col-span-1 flex justify-center text-center">
  <div className="flex flex-col items-center">
    <div><FaArrowUp /></div>
    <div>{incident.engagement.views}k</div>
  </div>
  <div className="flex flex-col items-center ml-4">
    <div><FaEye /></div>
    <div>{incident.engagement.shares}k</div>
  </div>
  <div className="flex flex-col items-center ml-4">
    <div><FaCommentAlt /></div>
    <div>{incident.engagement.comments}</div>
  </div>
</div>
 
          <div className="col-span-1 flex justify-center truncate">{incident.address}</div>
        </div>
      ))}
    </div>
  );
  
};

export default IncidentTable;
