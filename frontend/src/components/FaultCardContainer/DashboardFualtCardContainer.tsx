import React, { useState } from "react";
import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";
import FaultCardUser from "@/components/FaultCardUser/FaultCardUser";
 interface CardData {
  dateClosed: string;
  upvotes : number;
  ticket_id : string;
  asset_id: string;
  state: string;
  dateOpened: string;
  imageURL: string;
  viewcount : number
  description: string;
  municipality_id: string;
  commentcount : number
  address : string ;
}

interface CardComponentProps {
  cardData: CardData[];
}

const DashboardFaultCardContainer: React.FC<CardComponentProps> = ({ cardData = [] }) => {
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


  // Function to handle displaying the next set of items
  const showNextItems = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + itemsPerPage, cardData.length - itemsPerPage));
  };

  // Function to handle displaying the previous set of items
  const showPreviousItems = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  // Calculate which items to display based on startIndex and itemsPerPage
  const visibleItems = cardData
    .slice(startIndex, Math.min(startIndex + itemsPerPage, cardData.length))
    .map((item, index) => (
      <FaultCardUser
        key={item.ticket_id}
        title={item.asset_id}
        address={item.address}
        arrowCount={item.upvotes}
        commentCount={item.commentcount}
        viewCount={item.viewcount}
        description={item.description}
        image={item.imageURL}
        createdBy={item.dateOpened}
        ticketNumber={item.ticket_id}
        onClick={() => handleCardClick(item)}
      />
    ));

  return (
    <div className="flex flex-col items-center w-full rounded-lg shadow-md overflow-hidden m-2">
        <div
          className="w-full overflow-x-auto custom-scrollbar"
          style={{
            paddingLeft: '16px',
            paddingRight: '16px',
            scrollbarWidth: 'thin', // For Firefox
            scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent', // For Firefox
          }}
        >
          <style jsx>{`
            ::-webkit-scrollbar {
              height: 6px; /* Make the scrollbar smaller */
            }
            ::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.5); /* Color of the scrollbar */
              border-radius: 3px; /* Roundness of the scrollbar */
            }
            ::-webkit-scrollbar-track {
              background: transparent; /* Color of the track */
            }
          `}</style>
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
          arrowCount={selectedCard.upvotes}
          commentCount={selectedCard.commentcount}
          viewCount={selectedCard.viewcount}
          ticketNumber={selectedCard.asset_id}
          description={selectedCard.description}
          image={selectedCard.imageURL}
          createdBy={selectedCard.dateOpened}
        />
      )}
    </div>
  );
};

export default DashboardFaultCardContainer
