import React, { useState } from 'react';
import Tender from '../Tenders/MuniTenderMini';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'unassigned' | 'active' | 'closed' | 'rejected';

interface TenderType {
  id: string;
  ticketId: string;
  title: string;
  status: Status;
  assignedTo: string;
  address: string;
  urgency: Urgency;
}

const tenders: TenderType[] = [
  { id: 'T001', ticketId: 'SA0245', title: 'Road Repair', status: 'unassigned', assignedTo: '', address: '123 Main St', urgency: 'high' },
  { id: 'T002', ticketId: 'SA0245', title: 'Sewer Maintenance', status: 'unassigned', assignedTo: '', address: '456 Oak St', urgency: 'medium' },
  { id: 'T003', ticketId: 'SA0246', title: 'Electric Line Fix', status: 'active', assignedTo: 'John Doe', address: '789 Pine St', urgency: 'low' },
  { id: 'T004', ticketId: 'SA0246', title: 'Tree Trimming', status: 'unassigned', assignedTo: '', address: '101 Maple St', urgency: 'medium' },
  { id: 'T005', ticketId: 'SA0247', title: 'Street Light Repair', status: 'unassigned', assignedTo: '', address: '202 Elm St', urgency: 'high' },
  { id: 'T006', ticketId: 'SA0248', title: 'Park Maintenance', status: 'closed', assignedTo: 'Jane Smith', address: '303 Birch St', urgency: 'low' },
  { id: 'T007', ticketId: 'SA0248', title: 'Building Inspection', status: 'unassigned', assignedTo: '', address: '404 Cedar St', urgency: 'medium' },
  { id: 'T008', ticketId: 'SA0245', title: 'Pothole Filling', status: 'rejected', assignedTo: 'Bob Lee', address: '505 Spruce St', urgency: 'high' },
  { id: 'T009', ticketId: 'SA0245', title: 'Sidewalk Repair', status: 'unassigned', assignedTo: '', address: '606 Willow St', urgency: 'medium' },
  { id: 'T010', ticketId: 'SA0245', title: 'Water Line Fix', status: 'unassigned', assignedTo: '', address: '707 Fir St', urgency: 'low' },
];

export default function MuniTenders({ ticketId }: { ticketId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 10;

  // Filter tenders associated with the selected ticket ID and unassigned status
  const filteredTenders = tenders.filter(tender => tender.ticketId === ticketId);

  // Calculate pagination details
  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTenders = filteredTenders.slice(indexOfFirstTender, indexOfLastTender);
  const totalPages = Math.ceil(filteredTenders.length / tendersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="overflow-x-auto bg-transparent rounded-lg shadow-md">
      <div className="min-w-full text-white text-opacity-80 rounded-t-lg text-black">
        <div className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 font-bold text-center border-b border-gray-200">
          <div className="col-span-1">Urgency</div>
          <div className="col-span-1">Tender ID</div>
          <div className="col-span-1">Title</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Assigned To</div>
          <div className="col-span-1">Address</div>
        </div>
      </div>
      <div className="min-w-full">
        {currentTenders.map(tender => (
          <Tender key={tender.id} tender={tender} />
        ))}
      </div>
      <div className="flex justify-between mt-4 text-white">
        <button 
          onClick={handlePrevPage} 
          className={`px-48 py-2 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={handleNextPage} 
          className={`px-48 py-2 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
