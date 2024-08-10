import React, { useState } from 'react';
import Record from './Record';
import CreateBid from '../Tenders/CreateBid';
import { useProfile } from "@/hooks/useProfile";


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

interface RecordTypeProps{
  records : RecordType[]
}

export default function OpenTicketsTable({records} : {records:RecordType[]}) {
  const userProfile = useProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<RecordType | null>(null);
  const recordsPerPage = 10;

  // Filter records with status "Unaddressed"
  const unaddressedRecords = records.filter(record => record.state === 'Unaddressed');

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
        </>
      ) : (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="transform scale-80 w-full">
            <CreateBid
              longitude= "23.2"
              latitude="38"
              ticket_id="acde812d-da20-4334-89af-35e56f580d36"
              company_name="Tesla"
              ticketnumber="ATR657"
              faultType="Mislabeled streets"
              address="R355, Cape Winelands District Municipality, Witzenberg Local Municipality, Western Cape"
              municipalityImage="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/Makana_Local.png"
              description="Come on municipality do better"
              onBack={handleBack}
            />
          </div>
        </div>
      )}
    </div>
  );
}
