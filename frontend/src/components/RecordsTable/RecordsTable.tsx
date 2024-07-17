import React, { useState } from 'react';
import Record from './Record';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'Fix in progress' | 'Unaddressed';

interface RecordType {
  id: string;
  faultType: string;
  status: Status;
  createdBy: string;
  address: string;
  urgency: Urgency;
}

const records: RecordType[] = [
  { id: 'SA0245', faultType: 'Leaking Sewerage', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high' },
  { id: 'SA0287', faultType: 'Bombs', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high' },
  { id: 'SA0298', faultType: 'Fire', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high' },
  // Add more records as needed for demonstration
  { id: 'SA0299', faultType: 'Water Leakage', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium' },
  { id: 'SA0300', faultType: 'Electricity Outage', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low' },
  { id: 'SA0301', faultType: 'Road Damage', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium' },
  { id: 'SA0302', faultType: 'Tree Fall', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high' },
  { id: 'SA0303', faultType: 'Street Light', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low' },
  { id: 'SA0304', faultType: 'Blocked Drain', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium' },
  { id: 'SA0305', faultType: 'Potholes', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low' },
  { id: 'SA0306', faultType: 'Noise Complaint', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium' },
  { id: 'SA0307', faultType: 'Garbage Collection', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low' },
  { id: 'SA0308', faultType: 'Animal Control', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high' },
  { id: 'SA0309', faultType: 'Parking Violation', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low' },
  { id: 'SA0310', faultType: 'Illegal Dumping', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high' },
  { id: 'SA0311', faultType: 'Public Disturbance', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium' },
];

export default function RecordsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Calculate pagination details
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

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
        <div className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 font-bold text-center border-b border-gray-200">
          <div className="col-span-1">Urgency</div>
          <div className="col-span-1">Ticket Number</div>
          <div className="col-span-1">Fault Type</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Created By</div>
          <div className="col-span-1">Address</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>
      <div className="min-w-full">
        {currentRecords.map(record => (
          <Record key={record.id} record={record} />
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

