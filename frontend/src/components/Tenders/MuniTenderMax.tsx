
import React, { useState } from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  tender_id: string;
  company_id : string;
  companyname : string;
  datetimesubmitted : string;
  ticket_id: string;
  status: string;
  quote: number;
  estimatedTimeHours: number;
  upload: File | null;
  hasReportedCompletion: boolean | false;
}

function getStatus(status : string){
  switch (status) {
    case "accepted":
      return "accepted"
      break;
    case "rejected":
      return "rejected"
    case "submitted":
      return "submitted"
    case "under review":
      return "under_review"
    default:
      return "submitted"
      break;
  }
}

const statusStyles = {
  under_review: "text-blue-500 border-blue-500 rounded-full",
  accepted: "text-black bg-green-200 rounded-full",
  rejected: "text-black bg-red-200 rounded-full",
  submitted: "text-black bg-gray-200 rounded-full",
};

const TenderMax = ({ tender, onClose }: { tender: TenderType; onClose: () => void }) => {
  const [dialog, setDialog] = useState<{ action: string; show: boolean }>({ action: "", show: false });

  // Map "Fix in progress" to "Active" for the tender's status
  const tenderStatus = tender.status.charAt(0).toUpperCase() + tender.status.slice(1);

  const handleAction = (action: string) => {
    setDialog({ action, show: true });
  };

  const confirmAction = () => {
    toast.success(`${dialog.action} action confirmed.`);
    setDialog({ action: "", show: false });
    onClose();
  };

  const getDialogText = (action: string) => {
    switch (action) {
      case "Accept":
        return "Are you sure you want to accept this tender bid?";
      case "Decline":
        return "Are you sure you want to decline this tender bid?";
      case "Mark as Complete":
        return "Are you sure you want to mark this ticket as resolved?";
      case "Terminate Contract":
        return "Are you sure you want to terminate this tender contract?";
      default:
        return "";
    }
  };

  const handleConfirmClick = () => {
    confirmAction();
  };

  const formattedDate = tender.datetimesubmitted.split('T')[0]; // Format date to YYYY-MM-DD

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row">
          <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
            <FaTimes size={24} />
          </button>
          <div className="flex flex-col lg:flex-row w-full overflow-auto">
            {/* Left Section */}
            <div className="relative w-full lg:w-1/3 p-2 flex flex-col items-center">
              <div className="absolute top-7 left-2">
                <img src="https://via.placeholder.com/50" alt={tender.companyname} className="w-10 h-10 rounded-full mb-2" />
              </div>
              <div className="text-center text-black text-2xl font-bold mb-2">Tender {tender.tender_id}</div>
              <div className={`px-2 py-1 rounded-full text-sm border-2 mb-2 ${statusStyles[getStatus(tender.status)]}`}>{tenderStatus}</div>

              <div className="text-gray-700 mb-2">
                <strong>Associated Ticket:</strong> {tender.tender_id}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Issue Date:</strong> {formattedDate}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Proposed Price:</strong> R{tender.quote.toFixed(2)}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Estimated Duration:</strong> {tender.estimatedTimeHours} days
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Upload:</strong>
                {tender.upload ? (
                  <a href={URL.createObjectURL(tender.upload)} download className="text-blue-500 underline ml-2">
                    {tender.upload.name}
                  </a>
                ) : (
                  "No files attached"
                )}
              </div>
              <div className="flex flex-col items-center mb-4 w-full">
                <FaInfoCircle className="text-blue-500 mb-1" size={24} />
                <div className="text-gray-500 text-xs text-center">
                  {tenderStatus === "Active"
                    ? `This Tender Contract is currently ${tenderStatus}. ${tender.companyname} has${tender.hasReportedCompletion ? "" : " not"} submitted a completion report.`
                    : `This Tender Bid is currently ${tenderStatus}. Accepting it will assign ${tender.companyname} to Ticket ${tender.ticket_id}.`}
                </div>
              </div>

              <div className="mt-2 flex justify-center gap-2">
                <button className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300" onClick={onClose}>
                  Back
                </button>
                {tenderStatus === "Active" ? (
                  <>
                    <button className="bg-red-500 text-white text-sm rounded-lg px-2 py-1 hover:bg-red-600" onClick={() => handleAction("Terminate Contract")}>
                      Terminate Contract
                    </button>
                    <button className="bg-blue-500 text-white text-sm rounded-lg px-2 py-1 hover:bg-blue-600" onClick={() => handleAction("Mark as Complete")}>
                      Mark as Complete
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600" onClick={() => handleAction("Decline")}>
                      Decline
                    </button>
                    <button className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600" onClick={() => handleAction("Accept")}>
                      Accept
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Right Section */}
            <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center p-4">
              <div className="w-full h-full flex items-center justify-center text-gray-500">Map Placeholder</div>
            </div>
          </div>
        </div>
      </div>

      {dialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg text-black">
            <div className="mb-4">{getDialogText(dialog.action)}</div>
            <div className="flex justify-center gap-2">
              <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setDialog({ action: "", show: false })}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleConfirmClick}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default TenderMax;
