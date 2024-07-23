import React from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  id: string;
  ticketId: string;
  status: Status;
  serviceProvider: string;
  issueDate: string;
  price: number;
  estimatedDuration: number;
  upload: File | null;
  hasReportedCompletion: boolean;
}

const statusStyles = {
  Unassigned: "text-blue-500 border-blue-500 rounded-full",
  Active: "text-black bg-green-200 rounded-full",
  Rejected: "text-black bg-red-200 rounded-full",
  Closed: "text-black bg-gray-200 rounded-full",
};

const TenderMax = ({
  tender,
  onClose,
}: {
  tender: TenderType;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row">
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>
        <div className="flex flex-col lg:flex-row w-full overflow-auto">
          {/* Left Section */}
          <div className="relative w-full lg:w-1/3 p-2 flex flex-col items-center">
            <div className="absolute top-7 left-2">
              <img
                src="https://via.placeholder.com/50"
                alt={tender.serviceProvider}
                className="w-10 h-10 rounded-full mb-2"
              />
            </div>
            <div className="text-center text-black text-2xl font-bold mb-2">
              Tender {tender.id}
            </div>
            <div
              className={`px-2 py-1 rounded-full text-sm border-2 mb-2 ${
                statusStyles[tender.status]
              }`}
            >
              {tender.status}
            </div>

            <div className="text-gray-700 mb-2">
              <strong>Associated Ticket:</strong> {tender.ticketId}
            </div>
            <div className="text-gray-700 mb-2">
              <strong>Issue Date:</strong> {tender.issueDate}
            </div>
            <div className="text-gray-700 mb-2">
              <strong>Proposed Price:</strong> R{tender.price.toFixed(2)}
            </div>
            <div className="text-gray-700 mb-2">
              <strong>Estimated Duration:</strong> {tender.estimatedDuration}{" "}
              days
            </div>
            <div className="text-gray-700 mb-2">
              <strong>Upload:</strong>{" "}
              {tender.upload ? (
                <a
                  href={URL.createObjectURL(tender.upload)}
                  download
                  className="text-blue-500 underline ml-2"
                >
                  {tender.upload.name}
                </a>
              ) : (
                "No files attached"
              )}
            </div>
            <div className="flex flex-col items-center mb-4 w-full">
              <FaInfoCircle className="text-blue-500 mb-1" size={24} />
              <div className="text-gray-500 text-xs text-center">
                {tender.status === "Active"
                  ? `This Tender Contract is currently ${tender.status}. ${tender.serviceProvider} has${
                      tender.hasReportedCompletion ? "" : " not"
                    } submitted a completion report.`
                  : `This Tender Bid is currently ${tender.status}. Accepting it will assign ${tender.serviceProvider} to Ticket ${tender.ticketId}.`}
              </div>
            </div>

            <div className="mt-2 flex justify-center gap-2">
              <button
                className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300"
                onClick={onClose}
              >
                Back
              </button>
              {tender.status === "Active" ? (
                <>
                  <button className="bg-red-500 text-white text-sm rounded-lg px-2 py-1 hover:bg-red-600">
                    Terminate Contract
                  </button>
                  <button className="bg-blue-500 text-white text-sm rounded-lg px-2 py-1 hover:bg-blue-600">
                    Mark as Complete
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600">
                    Decline
                  </button>
                  <button className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">
                    Accept
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Right Section */}
          <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center p-4">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Map Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderMax;
