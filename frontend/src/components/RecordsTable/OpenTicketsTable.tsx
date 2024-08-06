import React, { useState } from 'react';
import Record from './Record';
import MuniTenders from './MuniTenders';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'Fix in progress' | 'Unaddressed';
type TenderStatus = "Unassigned" | "Active" | "Rejected" | "Closed";

interface RecordType {
  id: string;
  faultType: string;
  status: Status;
  createdBy: string;
  address: string;
  urgency: Urgency;
}

interface TenderType {
  id: string;
  tender_id: string;
  tendernumber: string;
  company_id: string;
  companyname: string;
  serviceProvider: string;
  datetimesubmitted: string;
  ticket_id: string;
  status: TenderStatus;
  quote: number;
  estimatedTimeHours: number;
  upload: File | null;
  hasReportedCompletion: boolean;
}

const records: RecordType[] = [
  { id: 'SA0245', faultType: 'Leaking Sewerage', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high' },
  { id: 'SA0287', faultType: 'Bombs', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high' },
  { id: 'SA0298', faultType: 'Fire', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'high' },
  // Add more records as needed for demonstration
  { id: 'SA0299', faultType: 'Water Leakage', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'medium' },
  { id: 'SA0300', faultType: 'Electricity Outage', status: 'Unaddressed', createdBy: 'Kyle Marshall', address: '312 Rupert Street', urgency: 'low' },
  { id: 'SA0301', faultType: 'Road Damage', status: 'Fix in progress', createdBy: 'Kyle Marshall', address: '312 Rupert Street BAAAAAAAAAAAA', urgency: 'medium' },
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

// Mock data for tenders
const mockTenders: TenderType[] = [
  {
    id: "1",
    tender_id: "T001",
    tendernumber: "TN001",
    company_id: "C001",
    companyname: "Company A",
    serviceProvider: "ServiceProvider A",
    datetimesubmitted: "2023-07-01T08:30:00Z",
    ticket_id: "SA0300",
    status: "Active",
    quote: 1500.5,
    estimatedTimeHours: 120,
    upload: null,
    hasReportedCompletion: false,
  },
  {
    id: "2",
    tender_id: "T002",
    tendernumber: "TN002",
    company_id: "C002",
    companyname: "Company B",
    serviceProvider: "ServiceProvider B",
    datetimesubmitted: "2023-07-02T09:15:00Z",
    ticket_id: "SA0302",
    status: "Active",
    quote: 2000.0,
    estimatedTimeHours: 72,
    upload: null,
    hasReportedCompletion: false,
  },
  // Add more mock tenders as needed
];

export default function OpenTicketsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
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

  const handleRecordClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };

  const handleBack = () => {
    setSelectedTicketId(null);
  };

  return (
    <div className="overflow-x-auto text-white text-center bg-transparent rounded-lg shadow-md">
      {!selectedTicketId ? (
        <>
          <div className="min-w-full text-white text-opacity-80 rounded-t-lg">
            <div className='text-xl font-bold'>Select a Ticket to see all Tender Bids submitted for it.</div>
            <div className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 font-bold text-center border-b border-gray-200 mt-6">
              <div className="col-span-1">Urgency</div>
              <div className="col-span-1">Ticket Number</div>
              <div className="col-span-1">Fault Type</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Created By</div>
              <div className="col-span-1">Address</div>
            </div>
          </div>
          <div className="min-w-full">
            {currentRecords.map(record => (
              <div key={record.id} onClick={() => handleRecordClick(record.id)}>
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
        <MuniTenders tenders={mockTenders.filter(tender => tender.ticket_id === selectedTicketId)} onBack={handleBack} />
      )}
    </div>
  );
}
