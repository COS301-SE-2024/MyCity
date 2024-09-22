import React, { useState, useEffect } from "react";
import Tender from "../Tenders/MuniTenderMini"; // Update the import path if necessary
import { FaInfoCircle, FaTimes } from "react-icons/fa";

type TenderStatus = "under_review" | "rejected" | "submitted" | "approved";

interface TenderType {
  tender_id: string;
  tendernumber: string;
  company_id: string;
  companyname: string;
  datetimesubmitted: string;
  ticket_id: string;
  ticketnumber: string;
  status: TenderStatus;
  quote: number;
  estimatedTimeHours: number;
  longitude: string;
  latitude: string;
  upload: File | null;
  hasReportedCompletion: boolean;
}

// Mock Data


export default function ActiveTenders({ tenders, refresh }: { tenders?: TenderType[]; refresh: () => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTenders, setActiveTenders] = useState<TenderType[]>([]); // Explicitly set mock data

  const tendersPerPage = 10;

  useEffect(() => {
    // If tenders prop is passed, use that; otherwise, use mockTenders
    if (tenders && tenders.length > 0) {
      setActiveTenders(tenders);
    } 

    console.log("Tenders: ", activeTenders); // Check what's in tenders array
  }, [tenders]);

  // Calculate pagination details
  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTenders = activeTenders.slice(indexOfFirstTender, indexOfLastTender);
  const totalPages = Math.ceil(activeTenders.length / tendersPerPage);

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

  const handleClose = (data: number) => {
    refresh();
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto bg-transparent rounded-lg shadow-md">
        <div className="min-w-full text-white text-opacity-80 rounded-t-lg relative">
          <div className="text-xl font-bold text-center">
            Click on a Tender to view more details.
          </div>
          <div className="grid grid-cols-6 gap-4 items-center mb-2 mt-6 px-2 py-1 font-bold text-center border-b border-gray-200">
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Tender ID</div>
            <div className="col-span-1">Service Provider</div>
            <div className="col-span-1">Issue Date</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Estimated Duration</div>
          </div>
          <div className="min-w-full">
            {currentTenders.length > 0 ? (
              currentTenders.map((tender) => (
                <Tender key={tender.tender_id} onClose={handleClose} tender={tender} />
              ))
            ) : (
              <div className="mt-16 text-white text-opacity-80 text-center">No Active Tenders to display.</div>
            )}
          </div>

          {currentTenders.length > 0 && (
            <div className="flex justify-between mt-4 text-white">
              <button
                onClick={handlePrevPage}
                className={`px-48 py-2 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                className={`px-48 py-2 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

  {/* Mobile View */}
<div className="block sm:hidden">
  <div className="text-xl font-bold text-white text-opacity-80 text-center mb-4">
    Click on a Tender to view more details.
  </div>

  {/* Tenders Listing and Pagination Container */}
  <div className="min-w-full space-y-2 overflow-y-auto pb-32" style={{ maxHeight: "75vh" }}>
    {currentTenders.length > 0 ? (
      currentTenders.map((tender) => (
        <Tender key={tender.tender_id} onClose={handleClose} tender={tender} />
      ))
    ) : (
      <div className="mt-16 text-white text-opacity-80 text-center">
        No Active Tenders to display.
      </div>
    )}

    {/* Pagination (comes directly after the last tender) */}
    {currentTenders.length > 0 && (
      <div className="flex justify-center text-center items-center mt-4 text-white space-x-4">
        <button
          onClick={handlePrevPage}
          className={`px-4 py-2 text-md ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-md">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          className={`px-4 py-2 text-md ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    )}
  </div>
</div>




    </>
  );
}
