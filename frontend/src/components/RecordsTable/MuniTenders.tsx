import React, { useState } from 'react';
import Tender from '../Tenders/MuniTenderMini'; // Update the import path if necessary

type Status = 'Fix in progress' | 'Unaddressed';

interface TenderType {
  id: string;
  ticketId: string;
  status: Status;
  serviceProvider: string;
  issueDate: string;
  price: number;
  estimatedDuration: number;
  upload: File | null;
}

const tenders: TenderType[] = [ //mock data
  { id: 'T001', ticketId: 'SA0300', status: 'Unaddressed', serviceProvider: 'Service Provider A', issueDate: '2023-07-01', price: 1500.50, estimatedDuration: 5, upload: null },
  { id: 'T002', ticketId: 'SA0302', status: 'Unaddressed', serviceProvider: 'Service Provider B', issueDate: '2023-07-02', price: 2000.00, estimatedDuration: 3, upload: null },
  { id: 'T003', ticketId: 'SA0304', status: 'Unaddressed', serviceProvider: 'Service Provider C', issueDate: '2023-07-03', price: 2500.75, estimatedDuration: 4, upload: null },
  { id: 'T004', ticketId: 'SA0306', status: 'Unaddressed', serviceProvider: 'Service Provider D', issueDate: '2023-07-04', price: 1800.00, estimatedDuration: 2, upload: null },
  { id: 'T005', ticketId: 'SA0310', status: 'Unaddressed', serviceProvider: 'Service Provider E', issueDate: '2023-07-05', price: 2200.00, estimatedDuration: 3, upload: null },
  { id: 'T006', ticketId: 'SA0300', status: 'Unaddressed', serviceProvider: 'Service Provider F', issueDate: '2023-07-06', price: 1700.50, estimatedDuration: 4, upload: null },
  { id: 'T007', ticketId: 'SA0304', status: 'Unaddressed', serviceProvider: 'Service Provider G', issueDate: '2023-07-07', price: 2600.00, estimatedDuration: 5, upload: null },
  { id: 'T008', ticketId: 'SA0302', status: 'Unaddressed', serviceProvider: 'Service Provider H', issueDate: '2023-07-08', price: 2400.75, estimatedDuration: 2, upload: null },
  { id: 'T009', ticketId: 'SA0306', status: 'Unaddressed', serviceProvider: 'Service Provider I', issueDate: '2023-07-09', price: 2100.00, estimatedDuration: 4, upload: null },
  { id: 'T010', ticketId: 'SA0310', status: 'Unaddressed', serviceProvider: 'Service Provider J', issueDate: '2023-07-10', price: 1900.50, estimatedDuration: 3, upload: null },
  { id: 'T011', ticketId: 'SA0300', status: 'Unaddressed', serviceProvider: 'Service Provider K', issueDate: '2023-07-11', price: 2300.00, estimatedDuration: 5, upload: null },
  { id: 'T012', ticketId: 'SA0304', status: 'Unaddressed', serviceProvider: 'Service Provider L', issueDate: '2023-07-12', price: 2500.00, estimatedDuration: 4, upload: null },
  { id: 'T013', ticketId: 'SA0302', status: 'Unaddressed', serviceProvider: 'Service Provider M', issueDate: '2023-07-13', price: 2000.50, estimatedDuration: 3, upload: null },
  { id: 'T014', ticketId: 'SA0306', status: 'Unaddressed', serviceProvider: 'Service Provider N', issueDate: '2023-07-14', price: 2200.00, estimatedDuration: 5, upload: null },
  { id: 'T015', ticketId: 'SA0310', status: 'Unaddressed', serviceProvider: 'Service Provider O', issueDate: '2023-07-15', price: 1800.75, estimatedDuration: 2, upload: null },
  { id: 'T016', ticketId: 'SA0300', status: 'Unaddressed', serviceProvider: 'Service Provider P', issueDate: '2023-07-16', price: 2700.00, estimatedDuration: 4, upload: null },
  { id: 'T017', ticketId: 'SA0304', status: 'Unaddressed', serviceProvider: 'Service Provider Q', issueDate: '2023-07-17', price: 2600.50, estimatedDuration: 3, upload: null },
  { id: 'T018', ticketId: 'SA0302', status: 'Unaddressed', serviceProvider: 'Service Provider R', issueDate: '2023-07-18', price: 2100.00, estimatedDuration: 2, upload: null },
  { id: 'T019', ticketId: 'SA0306', status: 'Unaddressed', serviceProvider: 'Service Provider S', issueDate: '2023-07-19', price: 2300.75, estimatedDuration: 5, upload: null },
  { id: 'T020', ticketId: 'SA0310', status: 'Unaddressed', serviceProvider: 'Service Provider T', issueDate: '2023-07-20', price: 2500.00, estimatedDuration: 4, upload: null }
];

export default function MuniTenders({ ticketId, onBack }: { ticketId: string, onBack: () => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 10;

  // Filter tenders associated with the selected ticket ID and unaddressed status
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
      <div className="min-w-full text-white text-opacity-80 rounded-t-lg text-black relative">
        <div className="flex justify-between items-center mb-2 px-2 py-1 font-bold text-center relative">
          <button
            onClick={onBack}
            className="text-white text-xl hover:text-gray-300 focus:outline-none"
          >
            &lt; Back
          </button>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
            Tender Bids
          </div>
        </div>
        {currentTenders.length > 0 ? (
          <>
            <div className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 font-bold text-center border-b border-gray-200">
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Tender ID</div>
              <div className="col-span-1">Ticket ID</div>
              <div className="col-span-1">Service Provider</div>
              <div className="col-span-1">Issue Date</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Estimated Duration</div>
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
          </>
        ) : (
          <div className="text-white text-center py-16">
            This ticket has no bids yet.
          </div>
        )}
      </div>
    </div>
  );
  
  
}
