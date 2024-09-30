import React, { useState } from "react";
import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";
import FaultCardUser from "@/components/FaultCardUser/FaultCardUser";
import { PaginatedResults } from "@/types/custom.types";
import { Page } from "@playwright/test";
import { getMostUpvote, getTicketsInMunicipality, getWatchlistTickets } from "@/services/tickets.service";
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

const DashboardFaultCardContainer: React.FC<CardComponentProps> = ({ type, result, refreshwatch }) => {
  const userProfile = useProfile();
  const itemsPerPage = 15;
  const [currentPageNum, setCurrentPageNum] = useState(0);
  const [cardData, setCardData] = useState<CardData[]>(result.items);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(result.lastEvaluatedKey);
  const [dataHistory, setDataHistory] = useState<CardData[][]>([cardData]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const handleCardClick = (cardData: CardData) => {
    // update url to include ticket id parameter
    const url = new URL(window.location.href);
    url.searchParams.set("t_id", cardData.ticket_id);
    window.history.pushState({}, "", url.toString());

    setSelectedCard(cardData);
    setShowModal(true);
  };

  // Calculate total pages
  // const totalPages = Math.ceil(cardData.length / itemsPerPage);

  // Get the current page items
  // const currentPageNumItems = cardData.slice(startIndex, startIndex + itemsPerPage);

  // Function to go to the next page
  const goToNextPage = async () => {
    const newPageNumber = currentPageNum + 1;
    if (dataHistory[newPageNumber]) {
      setCardData(dataHistory[newPageNumber]);
      setCurrentPageNum(newPageNumber);
      return;
    }

    let reso: PaginatedResults | null;

    if (type == "watchlist") {
      reso = await fetchWatchlistData();
    } else if (type == "mostupvoted") {
      reso = await fetchMostUpvoteData();
    }
    else if (type == "nearest") {
      reso = await fetchTcketsInMunicipalityData();
    }
    else {
      console.log("No data to fetch");
      return;
    }

    if (reso) {
      setCardData(reso.items);
      setCurrentPageNum(newPageNumber);
      setLastEvaluatedKey(reso.lastEvaluatedKey);
      const newHistory = [...dataHistory];  // create a new array (copy the old one)
      newHistory[newPageNumber] = reso.items as CardData[];  // add the new data to the new array
      setDataHistory(newHistory);
    }
  };

  // Function to go to the previous page
  const goToPreviousPage = () => {
    if (currentPageNum === 0) {
      return;
    }

    const newPageNumber = currentPageNum - 1;
    if (dataHistory[newPageNumber]) {
      setCardData(dataHistory[newPageNumber]);
      setCurrentPageNum(newPageNumber);
    }
  };

  const handleCloseModal = () => {
    // update url to remove ticket id parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("t_id");
    window.history.replaceState({}, "", url.toString());

    setShowModal(false);
    setSelectedCard(null);
  };

  const visibleItems = cardData.map((item) => (
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

  const fetchWatchlistData = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_id = user_data.current?.email ?? "";
      const user_session = String(user_data.current?.session_token);
      const user_email = String(user_id).toLowerCase();
      const reso = await getWatchlistTickets(user_email, user_session, lastEvaluatedKey);

      return reso;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const fetchMostUpvoteData = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const reso = await getMostUpvote(user_session, lastEvaluatedKey);

      return reso;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const fetchTcketsInMunicipalityData = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const municipality = user_data.current?.municipality;
      const reso = await getTicketsInMunicipality(municipality, user_session, lastEvaluatedKey);

      return reso;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  return (
    <div>
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
              className={`px-4 py-2 w-[25%] text-white ${currentPageNum === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPageNum === 0}
            >
              Previous
            </button>
  
            <span className="text-white text-opacity-80">
              Page {currentPageNum + 1}
            </span>
  
            <button
              onClick={goToNextPage}
              className={`px-4 py-2 w-[25%] ${currentPageNum + itemsPerPage >= cardData.length
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-white text-black"
              }`}
              disabled={!lastEvaluatedKey}
            >
              Next
            </button>
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
      </div>
  
      {/* Mobile View */}
      <div className="block sm:hidden overflow-hidden">
        <div className="flex h-[60%] w-full rounded-3xl shadow-md overflow-hidden">
          <div
            className="w-full overflow-y-auto custom-scrollbar rounded-3xl"
            style={{
              paddingLeft: "8px",
              paddingRight: "8px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
            }}
          >
            <style jsx>{`
              ::-webkit-scrollbar {
                width: 4px;
              }
              ::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.7);
                border-radius: 9999px;
              }
              ::-webkit-scrollbar-track {
                background: transparent;
                margin: 8px 0;
              }
            `}</style>
            <div className="grid grid-cols-2 gap-4">
              {visibleItems.map((item, index) => (
                <div key={index} className="text-center">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Mobile Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPreviousPage}
            className={`px-4 py-2 text-white ${currentPageNum === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={currentPageNum === 0}
          >
            Previous
          </button>
  
          <span className="text-white text-opacity-80">
            Page {currentPageNum + 1}
          </span>
  
          <button
            onClick={goToNextPage}
            className={`px-4 py-2 ${currentPageNum + itemsPerPage >= cardData.length
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-white text-black"
            }`}
            disabled={!lastEvaluatedKey}
          >
            Next
          </button>
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
    </div>
  );
  
};

export default DashboardFaultCardContainer;
