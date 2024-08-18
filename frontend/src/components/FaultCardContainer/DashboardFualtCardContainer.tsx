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
}

const DashboardFaultCardContainer: React.FC<CardComponentProps> = ({ cardData = [] }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 10;
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

  const showNextItems = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + itemsPerPage, cardData.length - itemsPerPage));
  };

  const showPreviousItems = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  const visibleItems = cardData
    .slice(startIndex, Math.min(startIndex + itemsPerPage, cardData.length))
    .map((item) => (
      <div key={item.ticket_id} className="mr-4"> {/* Added margin-right for spacing */}
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
          }}
          onClick={() => handleCardClick(item)}
        />
      </div>
    ));

  return (
    <div className="flex flex-col items-center w-full rounded-3xl shadow-md overflow-hidden m-2">
      <div
        className="w-full overflow-x-auto custom-scrollbar rounded-3xl"
        style={{
          paddingLeft: '16px',
          paddingRight: '16px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
        }}
      >
        <style jsx>{`
          ::-webkit-scrollbar {
            height: 4px; /* Smaller height for the scrollbar */
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.7); /* Lighter color */
            border-radius: 9999px; /* Fully rounded scrollbar */
            min-width: 20px; /* Minimum width to reduce the scrollbar thumb size */
          }
          ::-webkit-scrollbar-track {
            background: transparent;
            margin: 8px 0; /* Shrink the scrollable area by increasing the margin */
          }
        `}</style>
        <div className="flex justify-start mb-4">
          <div className="flex text-center flex-nowrap">
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
          ticketId={selectedCard.ticket_id}
          ticketNumber={selectedCard.ticketnumber}
          description={selectedCard.description}
          image={selectedCard.imageURL}
          createdBy={selectedCard.createdby}
          latitude={selectedCard.latitude}
          longitude={selectedCard.longitude}
          urgency={selectedCard.urgency}
        />
      )}
    </div>
  );
};

export default DashboardFaultCardContainer;
