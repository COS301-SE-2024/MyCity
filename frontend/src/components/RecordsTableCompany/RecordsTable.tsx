import React, { useState } from 'react';
import Record from './Record';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'Fix in progress' | 'Unaddressed';

interface RecordType {
  ticket_id: string;
  ticketnumber : string;
  asset_id: string;
  user_picture : string;
  municipality_picture : string ;
  description : string;
  imageURL : string;
  state: string;
  address: string;
  createdby: string;
  viewcount : number;
  commentcount: number;
  latitude : string;
  longitude : string;
  upvotes : number;
  urgency: Urgency;
  municipality : string;
}

interface RecordTypeProps {
  records : RecordType[]
}

const RecordsTable: React.FC<RecordTypeProps> = ({records = []}) => {
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
      {/* Desktop View */}
      <div className="hidden sm:block min-w-full text-white text-opacity-80 rounded-t-lg text-black">
        <div className="grid grid-cols-6 gap-4 items-center mb-2 px-2 py-1 font-bold text-center border-b border-gray-200">
          <div className="col-span-1">Urgency</div>
          <div className="col-span-1">Ticket Number</div>
          <div className="col-span-1">Fault Type</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Created By</div>
          <div className="col-span-1">Municipality</div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        {/* Column headings are omitted for mobile view */}
      </div>

      <div className="min-w-full">
        {currentRecords.map(record => (
          <Record key={record.ticket_id} record={record} />
        ))}
      </div>

      {/* Pagination Section */}
<div className="flex justify-center items-center mt-4 text-white space-x-4">
  <button 
    onClick={handlePrevPage} 
    className={`px-4 py-2 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span className="text-center">Page {currentPage} of {totalPages}</span>
  <button 
    onClick={handleNextPage} 
    className={`px-4 py-2 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

    </div>
  );
}

export default RecordsTable;
