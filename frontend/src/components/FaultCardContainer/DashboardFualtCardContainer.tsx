import React, { useState } from "react";
import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";
import DashboardFaultCardUser from "@/components/FaultCardUser/DashboardFaultCardUser";
import FaultCardUser from "@/components/FaultCardUser/FaultCardUser";
interface CardData {
  dateClosed: string;
  upvote : number;
  asset_id: string;
  state: string;
  dateOpened: string;
  imageURL: string;
  viewcount : number
  description: string;
  municipality_id: string;
  createdBy: string;
}

const DashboardFaultCardContainer: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0); // Index to track the starting point of displayed items
  const itemsPerPage = 7; // Number of items to display per page
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const handleCardClick = (cardData: CardData) => {
    setSelectedCard(cardData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const cardData: CardData[] = [
  ];

  // Function to handle displaying the next set of items
  const showNextItems = () => {
    setStartIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  // Function to handle displaying the previous set of items
  const showPreviousItems = () => {
    setStartIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  // Calculate which items to display based on startIndex and itemsPerPage
  const visibleItems = cardData
    .slice(startIndex, startIndex + itemsPerPage)
    .map((item, index) => (
      <DashboardFaultCardUser
        key={startIndex + index}
        title={item.asset_id}
        address={item.address}
        arrowCount={item.upvote}
        commentCount={item.commentCount}
        viewCount={item.viewcount}
        description={item.description}
        image={item.imageURL}
        createdBy={item.dateOpened}
        onClick={() => handleCardClick(item)}
      />
    ));

  return (
    <div className="flex flex-col items-center w-full bg-white rounded-lg shadow-md overflow-hidden m-2">
    <div className="w-full overflow-x-auto custom-scrollbar" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
      <div className="flex justify-start">
        <div className="flex mb-8 text-center flex-nowrap">
          {/* Display multiple FaultCardUser components */}
          {visibleItems}
        </div>
      </div>
    </div>
      {showModal && selectedCard && (
        <FaultCardUserView
          show={showModal}
          onClose={handleCloseModal}
          title={selectedCard.asset_id}
          address={selectedCard.address}
          arrowCount={selectedCard.upvote}
          commentCount={selectedCard.commentCount}
          viewCount={selectedCard.viewcount}
          ticketNumber={selectedCard.asset_id}
          description={selectedCard.description}
          image={selectedCard.imageURL}
          createdBy={selectedCard.createdBy}
        />
      )}
    </div>
  );
};

export default DashboardFaultCardContainer
