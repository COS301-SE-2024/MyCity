import React, { useEffect, useState } from 'react';
import Record from './Record';
import CreateBid from '../Tenders/CreateBid';
import { ThreeDots } from "react-loader-spinner"; // Assuming you're using the react-loader-spinner package
import { useProfile } from "@/hooks/useProfile";

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

export default function OpenTicketsTable({ records }: { records: RecordType[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<RecordType | null>(null);
  const [loading, setLoading] = useState(true);
  const recordsPerPage = 10;

  useEffect(() => {
    // Simulate a loading delay for demo purposes
    const timer = setTimeout(() => setLoading(false), 2000); // Replace with real data fetching logic
    return () => clearTimeout(timer);
  }, []);

  // Filter records with status "Unaddressed"
  const unaddressedRecords = records.filter(record => record.state === 'Taking Tenders');

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
  };

  const handleBack = () => {
    setSelectedTicket(null);
  };

  

  return (
    <div className="overflow-x-auto text-white text-center bg-transparent rounded-lg shadow-md">
      <div className="min-w-full text-white text-opacity-80 rounded-t-lg">
        <div className='text-xl font-bold'>Select a Ticket to create a Tender Bid for it.</div>
        <div className="grid grid-cols-7 gap-4 items-center mb-2 px-4 py-1 font-bold text-center border-b border-gray-200 mt-6">
          <div className="col-span-1">Urgency</div>
          <div className="col-span-1">Ticket Number</div>
          <div className="col-span-1">Fault Type</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Created By</div>
          <div className="col-span-1">Address</div>
          <div className="col-span-1">Municipality</div>
        </div>
      </div>
      <div className="min-w-full">
        {currentRecords.map((record: RecordType) => (
          <div key={record.ticket_id} onClick={() => handleRecordClick(record)} className="px-4">
            <Record record={record} />
          </div>
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
