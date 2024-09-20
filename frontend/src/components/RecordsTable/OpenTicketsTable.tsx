import React, { useState } from 'react';
import Record from './Record';
import CreateBid from '../Tenders/CreateBid';
import TicketViewMuni from '../TicketViewMuni/TicketViewMuni';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'Fix in progress' | 'Unaddressed';

interface RecordType {
  ticket_id: string;
  ticketnumber: string;
  asset_id: string;
  user_picture: string;
  municipality_picture: string;
  description: string;
  imageURL: string;
  state: string;
  address: string;
  createdby: string;
  viewcount: number;
  commentcount: number;
  latitude: string;
  longitude: string;
  upvotes: number;
  urgency: Urgency;
  municipality: string;
}

export default function OpenTicketsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<RecordType | null>(null);
  const [showTicketView, setShowTicketView] = useState(false);
  const recordsPerPage = 10;

  // Mock ticket data inline
  const mockTickets: RecordType[] = [
    {
      ticket_id: 'TCK-001',
      ticketnumber: '12345',
      asset_id: 'ASSET-01',
      user_picture: 'https://example.com/user1.jpg',
      municipality_picture: 'https://example.com/muni1.jpg',
      description: 'Pothole on Main Street',
      imageURL: 'https://example.com/image1.jpg',
      state: 'Opened',
      address: '123 Main Street, Springfield',
      createdby: 'John Doe',
      viewcount: 120,
      commentcount: 15,
      latitude: '40.7128',
      longitude: '-74.0060',
      upvotes: 50,
      urgency: 'high',
      municipality: 'Springfield',
    },
    {
      ticket_id: 'TCK-002',
      ticketnumber: '12346',
      asset_id: 'ASSET-02',
      user_picture: 'https://example.com/user2.jpg',
      municipality_picture: 'https://example.com/muni2.jpg',
      description: 'Streetlight not working',
      imageURL: 'https://example.com/image2.jpg',
      state: 'Opened',
      address: '456 Elm Street, Springfield',
      createdby: 'Jane Smith',
      viewcount: 80,
      commentcount: 10,
      latitude: '40.7129',
      longitude: '-74.0061',
      upvotes: 30,
      urgency: 'medium',
      municipality: 'Springfield',
    },
    {
      ticket_id: 'TCK-003',
      ticketnumber: '12347',
      asset_id: 'ASSET-03',
      user_picture: 'https://example.com/user3.jpg',
      municipality_picture: 'https://example.com/muni3.jpg',
      description: 'Graffiti on wall',
      imageURL: 'https://example.com/image3.jpg',
      state: 'Opened',
      address: '789 Oak Street, Springfield',
      createdby: 'Bob Johnson',
      viewcount: 60,
      commentcount: 5,
      latitude: '40.7130',
      longitude: '-74.0062',
      upvotes: 20,
      urgency: 'low',
      municipality: 'Springfield',
    },
  ];

  // Filter records with status "Opened"
  const unaddressedRecords = mockTickets.filter(record => record.state === 'Opened');

  // Calculate pagination details
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = unaddressedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(unaddressedRecords.length / recordsPerPage);

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

  const handleRecordClick = (record: RecordType) => {
    setSelectedTicket(record);
    setShowTicketView(true);
  };

  const handleBack = () => {
    setSelectedTicket(null);
    setShowTicketView(false);
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto text-white text-center bg-transparent rounded-lg">
        <div className="min-w-full text-white text-opacity-80 rounded-t-lg">
          <div className='text-xl font-bold'>Select a Ticket to see all Tender Bids submitted for it.</div>
          <div className="grid grid-cols-6 gap-4 items-center mb-2 px-4 py-1 font-bold text-center border-b border-gray-200 mt-6">
            <div className="col-span-1">Urgency</div>
            <div className="col-span-1">Ticket Number</div>
            <div className="col-span-1">Fault Type</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Created By</div>
            <div className="col-span-1">Address</div>
          </div>
        </div>
        <div className="min-w-full">
          {currentRecords.length > 0 ? (
            currentRecords.map((record: RecordType) => (
              <div key={record.ticket_id} onClick={() => handleRecordClick(record)} className="px-4">
                <Record record={record} />
              </div>
            ))
          ) : (
            <div className="mt-16 text-white text-opacity-80">No Open Tickets to display.</div>
          )}
        </div>
        {currentRecords.length > 0 && (
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
        )}
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="text-xl font-bold text-white text-opacity-80 text-center mb-4">Select a Ticket to see all Tender Bids submitted for it.</div>
        <div className="min-w-full">
          {currentRecords.length > 0 ? (
            currentRecords.map((record: RecordType) => (
              <div key={record.ticket_id} onClick={() => handleRecordClick(record)} className="px-4">
                <Record record={record} />
              </div>
            ))
          ) : (
            <div className="mt-16 text-white text-center text-opacity-80">No Open Tickets to display.</div>
          )}
        </div>
        {currentRecords.length > 0 && (
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
        )}
      </div>
    </>
  );
}
