import React, { useState } from "react";
import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";
import FaultCardUser from "@/components/FaultCardUser/FaultCardUser";

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
  cardData: CardData[];
  refreshwatch: () => void;
}

const DashboardFaultCardContainer: React.FC<CardComponentProps> = ({
  cardData = [],
  refreshwatch,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 15;
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
  const totalPages = Math.ceil(cardData.length / itemsPerPage);

  // Get the current page items
  const currentPageItems = cardData.slice(startIndex, startIndex + itemsPerPage);

  // Function to go to the next page
  const goToNextPage = () => {
    if (startIndex + itemsPerPage < cardData.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  // Function to go to the previous page
  const goToPreviousPage = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
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

  const showNextItems = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerPage, cardData.length - itemsPerPage)
    );
  };

  const showPreviousItems = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  // console.log(cardData);

  const visibleItems = cardData
    .slice(startIndex, Math.min(startIndex + itemsPerPage, cardData.length))
    .map((item) => (
      <div key={item.ticket_id}>
        {" "}
        {/* Added margin-right for spacing */}
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
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex flex-col items-center w-full overflow-hidden">
          <div className=" flex justify-center grid grid-cols-5 grid-rows-3 gap-4 mx-2 mb-2 w-full h-[60%]">
            {visibleItems}
          </div>

          {/* Pagination Controls */}
          <div className="flex w-[50%] h-[10%] justify-between items-center mx-2">
            <button
              onClick={goToPreviousPage}
              className={`px-4 py-2 w-[25%]  text-white  ${
                startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={startIndex === 0}
            >
              Previous
            </button>

            <span className="text-white text-opacity-80">
              Page {startIndex / itemsPerPage + 1} of {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              className={`px-4 py-2 w-[25%]  text-white  ${
                startIndex + itemsPerPage >= cardData.length
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={startIndex + itemsPerPage >= cardData.length}
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
              scrollbarColor: "rgba(255, 255, 255, 0.3) transparent", // Adjust the height as needed
            }}
          >
            <style jsx>{`
              ::-webkit-scrollbar {
                width: 4px; /* Smaller width for vertical scrollbar */
              }
              ::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.7); /* Lighter color */
                border-radius: 9999px; /* Fully rounded scrollbar */
              }
              ::-webkit-scrollbar-track {
                background: transparent;
                margin: 8px 0; /* Shrink the scrollable area by increasing the margin */
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
    </div>
  );
};

export default DashboardFaultCardContainer;
