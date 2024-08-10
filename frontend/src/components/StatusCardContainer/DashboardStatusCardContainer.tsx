import React, { useState } from "react";
import StatusCardUserView from "@/components/StatusCardUserView/StatusCardUserView";
import StatusCardUser from "@/components/StatusCardUser/StatusCardUser";

interface CardData {
  dateClosed: string;
  upvotes: number;
  ticket_id: string;
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
}

interface CardComponentProps {
  cardData: CardData[];
}

const DashboardStatusCardContainer: React.FC<CardComponentProps> = ({
  cardData = [],
}) => {
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
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerPage, cardData.length - itemsPerPage)
    );
  };

  // Function to handle displaying the previous set of items
  const showPreviousItems = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  // Calculate which items to display based on startIndex and itemsPerPage
  const visibleItems = cardData
    // .slice(startIndex, Math.min(startIndex + itemsPerPage, cardData.length))
    // .map((item, index) => (
    //   // <StatusCardUser
    //   //   key={item.ticket_id}
    //   //   title={item.asset_id}
    //   //   address={item.address}
    //   //   arrowCount={item.upvotes}
    //   //   commentCount={item.commentcount}
    //   //   viewCount={item.viewcount}
    //   //   description={item.description}
    //   //   image={item.imageURL}
    //   //   createdBy={item.dateOpened}
    //   //   ticketNumber={item.ticket_id}
    //   //   municipality_id={item.municipality_id}
    //   //   state={item.state}
    //   //   onClick={() => handleCardClick(item)}
    //   // />
    // ));

  return (
    <div className="flex flex-col items-center w-full rounded-lg shadow-md overflow-hidden m-2">
      <div
        className="w-full overflow-x-auto custom-scrollbar"
        style={{
          paddingLeft: "16px",
          paddingRight: "16px",
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "rgba(255, 255, 255, 0.5) transparent", // For Firefox
        }}
      >
        {/* style goes here */}
        <div className="flex justify-start">
          <div className="flex mb-8 text-center flex-nowrap">
            {/* Display multiple FaultCardUser components */}
            {/* {visibleItems} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatusCardContainer;
