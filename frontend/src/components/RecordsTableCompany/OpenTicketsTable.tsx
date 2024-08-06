import React, { useState } from 'react';
import Record from './Record';
import CreateBid from '../Tenders/CreateBid';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'Fix in progress' | 'Unaddressed';

interface RecordType {
  id: string;
  faultType: string;
  status: Status;
  createdBy: string;
  address: string;
  urgency: Urgency;
  municipality: string;
}

const records: RecordType[] = [
  { id: 'SA0245', faultType: 'Leaking Sewerage', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high', municipality: 'City of Cape Town' },
  { id: 'SA0287', faultType: 'Bombs', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high', municipality: 'City of Cape Town' },
  { id: 'SA0298', faultType: 'Fire', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high', municipality: 'City of Cape Town' },
  { id: 'SA0299', faultType: 'Water Leakage', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium', municipality: 'City of Cape Town' },
  { id: 'SA0300', faultType: 'Electricity Outage', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low', municipality: 'City of Cape Town' },
  { id: 'SA0301', faultType: 'Road Damage', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium', municipality: 'City of Cape Town' },
  { id: 'SA0302', faultType: 'Tree Fall', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high', municipality: 'City of Cape Town' },
  { id: 'SA0303', faultType: 'Street Light', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low', municipality: 'City of Cape Town' },
  { id: 'SA0304', faultType: 'Blocked Drain', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium', municipality: 'City of Cape Town' },
  { id: 'SA0305', faultType: 'Potholes', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low', municipality: 'City of Cape Town' },
  { id: 'SA0306', faultType: 'Noise Complaint', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium', municipality: 'City of Cape Town' },
  { id: 'SA0307', faultType: 'Garbage Collection', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low', municipality: 'City of Cape Town' },
  { id: 'SA0308', faultType: 'Animal Control', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high', municipality: 'City of Cape Town' },
  { id: 'SA0309', faultType: 'Parking Violation', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low', municipality: 'City of Cape Town' },
  { id: 'SA0310', faultType: 'Illegal Dumping', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high', municipality: 'City of Cape Town' },
  { id: 'SA0311', faultType: 'Public Disturbance', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium', municipality: 'City of Cape Town' },
];

export default function OpenTicketsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<RecordType | null>(null);
  const recordsPerPage = 10;

  // Filter records with status "Unaddressed"
  const unaddressedRecords = records.filter(record => record.status === 'Unaddressed');

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
      {!selectedTicket ? (
        <>
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
            {currentRecords.map(record => (
              <div key={record.id} onClick={() => handleRecordClick(record)} className="px-4">
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
        </>
      ) : (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="transform scale-80 w-full">
            <CreateBid
              ticket={{
                id: selectedTicket.id,
                faultType: selectedTicket.faultType,
                description: "Add description here", // Add actual description if available
                address: selectedTicket.address,
                municipalityImage: "https://via.placeholder.com/50" // Update with actual image URL
              }}
              onBack={handleBack}
            />
          </div>
        </div>
      )}
    </div>
  );
}
