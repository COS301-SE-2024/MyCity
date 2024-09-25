import React, { useState } from "react";
import Tender from "../Tenders/MuniTenderMini"; // Update the import path if necessary

type Status = 'Unassigned' | 'Active' | 'Rejected' | 'Closed';
interface TenderType {
  tender_id: string;
  tendernumber: string;
  company_id: string;
  companyname: string;
  serviceProvider: string; // Add serviceProvider here
  datetimesubmitted: string;
  ticketnumber : string;
  ticket_id: string;
  status: Status;
  quote: number;
  longitude : string;
  latitude : string;
  estimatedTimeHours: number;
  upload: File | null;
  hasReportedCompletion: boolean; // New prop
}

interface TenderTypeProps {
  tenders: TenderType[];
}

export default function MuniTenders({
  tenders,
  onBack,
}: {
  tenders: TenderType[];
  onBack: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const tendersPerPage = 10;

  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTenders = tenders.slice(
    indexOfFirstTender,
    indexOfLastTender
  );
  const totalPages = Math.ceil(tenders.length / tendersPerPage);

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
            className="bg-white bg-opacity-70 text-black ml-2 px-3 py-1 rounded-xl focus:outline-none hover:bg-opacity-90"
          >
            Back
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
              {currentTenders.map((tender) => (
                <Tender key={tender.ticket_id} tender={tender} onClose={onBack}/>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-white">
              <button
                onClick={handlePrevPage}
                className={`px-48 py-2 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                className={`px-48 py-2 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
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
