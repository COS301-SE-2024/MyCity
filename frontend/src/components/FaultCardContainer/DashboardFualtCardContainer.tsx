import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa"; // Import the filter icon
import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";
import FaultCardUser from "@/components/FaultCardUser/FaultCardUser";
import { PaginatedResults } from "@/types/custom.types";
import {
  getMostUpvote,
  getTicketsInMunicipality,
  getWatchlistTickets,
} from "@/services/tickets.service";
import { useProfile } from "@/hooks/useProfile";

interface CardData {
  dateClosed: string;
  upvotes: number;
  ticket_id: string;
  ticketnumber: string;
  asset_id: string;
  state: string;
  dateOpened: string;
  createdby: string;
  imageURL: string;
  viewcount: number;
  description: string;
  municipality_id: string;
  commentcount: number;
  user_picture: string;
  address: string;
  latitude: number;
  longitude: number;
  ticketID: string;
  urgency: "high" | "medium" | "low";
}

interface CardComponentProps {
  type: "watchlist" | "mostupvoted" | "nearest";
  result: PaginatedResults;
  refreshwatch: () => void;
}

const DashboardFaultCardContainer: React.FC<CardComponentProps> = ({
  type,
  result,
  refreshwatch,
}) => {
  const userProfile = useProfile();
  const itemsPerPage = 15;
  const [currentPageNum, setCurrentPageNum] = useState(0);
  const [cardData, setCardData] = useState<CardData[]>(result.items);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(
    result.lastEvaluatedKey
  );
  const [dataHistory, setDataHistory] = useState<CardData[][]>([cardData]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  // State for filtering by state
  const [selectedState, setSelectedState] = useState<string>("all");
  const selectRef = useRef<HTMLSelectElement>(null);

  const openDropdown = () => {
    if (selectRef.current) {
      selectRef.current.focus(); // Trigger the dropdown to open
    }
  };
  useEffect(() => {
    // Reset pagination when state filter is applied
    setCurrentPageNum(0);
  }, [selectedState]);

  const handleCardClick = (cardData: CardData) => {
    const url = new URL(window.location.href);
    url.searchParams.set("t_id", cardData.ticket_id);
    window.history.pushState({}, "", url.toString());

    setSelectedCard(cardData);
    setShowModal(true);
  };

  const goToNextPage = async () => {
    // Fetch new page data logic (same as before)
  };

  const goToPreviousPage = () => {
    if (currentPageNum === 0) return;
    setCurrentPageNum(currentPageNum - 1);
    setCardData(dataHistory[currentPageNum - 1]);
  };

  const handleCloseModal = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("t_id");
    window.history.replaceState({}, "", url.toString());

    setShowModal(false);
    setSelectedCard(null);
  };

  // Filter the card data based on state
  const filteredData = cardData.filter((item) => {
    return selectedState === "all" || item.state === selectedState;
  });

  const visibleItems = filteredData.map((item) => (
    <div key={item.ticket_id}>
      <FaultCardUser
        data={{
          title: item.asset_id,
          address: item.address,
          arrowCount: item.upvotes,
          commentCount: item.commentcount,
          viewCount: item.viewcount,
          description: item.description,
          image: item.imageURL,
          createdBy: item.dateOpened,
          ticketNumber: item.ticketnumber,
          ticketId: item.ticket_id,
          municipality_id: item.municipality_id,
          state: item.state,
        }}
        onClick={() => handleCardClick(item)}
      />
    </div>
  ));

  return (
    <div>
      <div className="flex justify-center items-center mb-4">
        <FaFilter className="text-white text-opacity-70 mr-2" size={18} />{" "}
        {/* Icon color set to white */}
        <select
          className="p-2 rounded-lg border border-transparent text-white text-opacity-70 bg-transparent"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          style={{ colorScheme: "dark" }} // Keeps the select element white but options black
        >
          <option value="all" className="text-black">
            All States
          </option>
          <option value="Opened" className="text-black">
            Opened
          </option>
          <option value="Taking Tenders" className="text-black">
            Taking Tenders
          </option>
          <option value="In Progress" className="text-black">
            In Progress
          </option>
          <option value="Closed" className="text-black">
            Closed
          </option>
        </select>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex flex-col items-center w-full overflow-hidden">
          <div className="flex justify-center grid grid-cols-5 grid-rows-3 gap-4 mx-2 mb-2 w-full h-[60%]">
            {visibleItems}
          </div>

          {/* Desktop Pagination Controls */}
          <div className="flex w-[50%] h-[10%] justify-between items-center mx-2">
            <button
              onClick={goToPreviousPage}
              className={`px-4 py-2 w-[25%] text-white ${
                currentPageNum === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPageNum === 0}
            >
              Previous
            </button>

            <span className="text-white text-opacity-80">
              Page {currentPageNum + 1}
            </span>

            <button
              onClick={goToNextPage}
              className={`px-4 py-2 w-[25%] text-white transition-transform ${
                lastEvaluatedKey
                  ? "hover:scale-105"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={!lastEvaluatedKey}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden overflow-hidden">
        <div className="flex h-[60%] w-full rounded-3xl shadow-md overflow-hidden">
          <div className="w-full overflow-y-auto custom-scrollbar rounded-3xl">
            <div className="grid grid-cols-2 gap-4">{visibleItems}</div>
          </div>
        </div>

        {/* Mobile Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPreviousPage}
            className={`px-4 py-2 text-white ${
              currentPageNum === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPageNum === 0}
          >
            Previous
          </button>

          <span className="text-white text-opacity-80">
            Page {currentPageNum + 1}
          </span>

          <button
            onClick={goToNextPage}
            className={`px-4 py-2 text-white transition-transform ${
              lastEvaluatedKey
                ? "hover:scale-105"
                : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={!lastEvaluatedKey}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && selectedCard && (
        <FaultCardUserView
          show={showModal}
          onClose={handleCloseModal}
          title={selectedCard.asset_id}
          address={selectedCard.address}
          arrowCount={selectedCard.upvotes}
          commentCount={selectedCard.commentcount}
          viewCount={selectedCard.viewcount}
          ticketId={selectedCard.ticket_id}
          ticketNumber={selectedCard.ticketnumber}
          description={selectedCard.description}
          image={selectedCard.imageURL}
          createdBy={selectedCard.createdby}
          latitude={selectedCard.latitude}
          longitude={selectedCard.longitude}
          urgency={selectedCard.urgency}
          municipality_id={selectedCard.municipality_id}
          state={selectedCard.state}
          refreshwatchlist={refreshwatch}
        />
      )}
    </div>
  );
};

export default DashboardFaultCardContainer;
