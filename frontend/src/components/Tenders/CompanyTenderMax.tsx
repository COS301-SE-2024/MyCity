import React, { useState } from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CompleteContract } from "@/services/tender.service";
import { useProfile } from "@/hooks/useProfile";
import dynamic from "next/dynamic";

const MapboxMap = dynamic(() => import("../MapboxMap/MapboxMap"), {
  ssr: false,
});

type Status = "Unassigned" | "Active" | "Rejected" | "Closed";

interface TenderType {
  contract_id : string;
  status : string;
  companyname : string;
  contractdatetime : string;
  finalCost : number;
  finalDuration : number;
  ticketnumber : string;
  longitude : string;
  latitude : string;
  completedatetime : string;
  contractnumber : string;
  municipality : string;
  upload: File | null;
  hasReportedCompletion: boolean | false;
  onClose : ()=> void;
}

const statusStyles = {
  in_progress: "text-blue-500 border-blue-500 rounded-full",
  completed: "text-green bg-green-300 rounded-full",
  closed: "text-red bg-red-300 rounded-full",
};

const TenderMax : React.FC<TenderType> = ({
  contract_id,
  status ,
  companyname,
  contractdatetime, 
  finalCost,
  finalDuration,
  ticketnumber,
  longitude,
  latitude,
  completedatetime,
  contractnumber,
  municipality,
  upload ,
  onClose,
  hasReportedCompletion,
}) => {
  const [dialog, setDialog] = useState<{ action: string; show: boolean }>({ action: "", show: false });
  const userProfile = useProfile();
  // Map "Fix in progress" to "Active" for the tender's status
  const tenderStatus = status;

  const handleAction = (action: string) => {
    setDialog({ action, show: true });
  };

  const confirmAction = async () => {
    switch (dialog.action) {
      case "Mark as Complete":
        {
          const user_data = await userProfile.getUserProfile();
          const user_session = String(user_data.current?.session_token);
          const rspcompleted = await CompleteContract(contract_id,user_session)
          if(rspcompleted == true)
          {
            toast.success(`${dialog.action} action confirmed.`);
            onClose();
          }
          else {
            toast.error(`${dialog.action} couldnt go through`)
          }
        }
        
        break;
      case "Terminate Contract" :
        {
          toast.success(`${dialog.action} action confirmed.`);
          onClose();
        }
    
      default:
        onClose();
        break;
    }
    setDialog({ action: "", show: false });
    onClose()
  };

  const getDialogText = (action: string) => {
    switch (action) {
      case "Accept":
        return "Are you sure you want to accept this tender bid?";
      case "Decline":
        return "Are you sure you want to decline this tender bid?";
      case "Mark as Complete":
        return "Are you sure you want to report this tender as completed?";
      case "Terminate Contract":
        return "Are you sure you want to terminate this tender contract?";
      default:
        return "";
    }
  };

  function getStatus(){
    switch (status) {
      case "in progress":
        return "in_progress"
        break;
      case "completed":
        return "completed"
      case "closed":
        return "closed"
        break;
      default:
        return "in_progress"
        break;
    }
  }

  const handleConfirmClick = () => {
    confirmAction();
  };

  const formattedDate = contractdatetime.split('T')[0]; // Format date to YYYY-MM-DD

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
              {/* <div className="absolute top-7 left-2">
                <img src="https://via.placeholder.com/50" alt={municipality} className="w-10 h-10 rounded-full mb-2" />
              </div> */}
              <div className="text-center text-black text-2xl font-bold mb-2">Contract </div>
              <div className={`px-2 py-1 rounded-full text-sm text-black border-2 mb-2 ${statusStyles[getStatus()]}`}>
  {tenderStatus.charAt(0).toUpperCase() + tenderStatus.slice(1)}
</div>


              <div className="text-gray-700 mb-2">
                <strong>Ticket:</strong> {ticketnumber}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Issue Date:</strong> {formattedDate}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Proposed Price:</strong> R{finalCost.toFixed(2)}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Estimated Duration:</strong> {finalDuration} days
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Upload:</strong>
                {upload ? (
                  <a href={URL.createObjectURL(upload)} download className="text-blue-500 underline ml-2">
                    {upload.name}
                  </a>
                ) : (
                  "No files attached"
                )}
              </div>
              <div className="flex flex-col items-center mb-4 w-full">
                <FaInfoCircle className="text-blue-500 mb-1" size={24} />
                <div className="text-gray-500 text-xs text-center">
                </div>
              </div>

              <div className="mt-2 flex justify-center gap-2">
                <button className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300" onClick={onClose}>
                  Back
                </button>
                {tenderStatus === "in progress" ? (
                  <>
                    <button className="bg-red-500 text-white text-sm rounded-lg px-2 py-1 hover:bg-red-600" onClick={() => handleAction("Terminate Contract")}>
                      Terminate Contract
                    </button>
                    <button className="bg-blue-500 text-white text-sm rounded-lg px-2 py-1 hover:bg-blue-600" onClick={() => handleAction("Mark as Complete")}>
                      Report Completion
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
              <div className="w-full h-full flex items-center justify-center text-gray-500" id="map">
              <MapboxMap centerLng={Number(longitude)} centerLat={Number(latitude)} dropMarker={true} zoom={14} />
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
