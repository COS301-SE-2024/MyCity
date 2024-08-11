import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MapComponent from "@/context/MapboxMap";

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  tender_id: string;
  status: string;
  companyname: string;
  contractdatetime: string;
  finalCost: number | null;
  finalDuration: number;
  ticketnumber: string;
  latitude: number;
  longitude: number;
  completedatetime: string;
  contractnumber: string;
  upload: File | null;
  hasReportedCompletion: boolean;
}

function getStatus(status: string) {
  switch (status) {
    case "completed":
      return "completed";
    case "closed":
      return "closed";
    case "in progress":
      return "in_progress";
    default:
      return "in_progress";
  }
}

const statusStyles = {
  in_progress: "text-blue-500 border-blue-500 rounded-full",
  completed: "text-green bg-green-200 rounded-full",
  closed: "text-red bg-red-200 rounded-full",
};

const TenderMax = ({ tender, onClose }: { tender: TenderType; onClose: () => void }) => {
  const [dialog, setDialog] = useState<{ action: string; show: boolean }>({ action: "", show: false });
  const modalRef = useRef<HTMLDivElement>(null);

  const tenderStatus = tender.status.charAt(0).toUpperCase() + tender.status.slice(1);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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

  const formattedDate = tender.contractdatetime.split('T')[0];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
        <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row">
          <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
            <FaTimes size={24} />
          </button>
          <div className="flex flex-col lg:flex-row w-full overflow-auto">
            {/* Left Section */}
            <div className="relative w-full lg:w-1/3 p-2 flex flex-col items-center">
              
              <div className="text-center text-black text-2xl font-bold mb-2">Contract</div>
              <div className={`px-2 py-1 rounded-full text-sm border-2 mb-2 ${statusStyles[getStatus(tender.status)]}`}>{tenderStatus}</div>

              <div className="text-gray-700 mb-2">
                <strong>Ticket:</strong> {tender.ticketnumber}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Issue Date:</strong> {formattedDate}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Proposed Price:</strong> R{(tender.finalCost || 0).toFixed(2)}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Estimated Duration:</strong> {tender.finalDuration} days
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
                  This Tender Contract is currently {tender.status}. {tender.companyname} has
                  {tender.hasReportedCompletion ? '' : ' not'} submitted a completion report.
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-2">
                <button className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300" onClick={onClose}>
                  Back
                </button>
                {(tender.status === "in progress" || tender.status === "completed") && (
                  <>
                    <button className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600">
                      Terminate Contract
                    </button>
                    <button className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">
                      Mark as Complete
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Right Section */}
            <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center p-4">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <MapComponent longitude={tender.longitude} latitude={tender.latitude} zoom={14} containerId="map" style="mapbox://styles/mapbox/streets-v12" />
              </div>
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
