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
  onClick: void;
}

interface CardComponentProps {
  cardData: CardData[];
}

const DashboardNotificationsCardContainer: React.FC<CardComponentProps> = ({
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
    .slice(startIndex, Math.min(startIndex + itemsPerPage, cardData.length))
    .map((item, index) => (
      <StatusCardUser
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
        municipality_id={item.municipality_id}
        state={item.state}
        onClick={() => handleCardClick(item)}
      />
    ));

  return (
    <div className="flex flex-col items-center w-full rounded-lg shadow-md overflow-hidden m-2 ">
      <div
        className="w-full overflow-x-auto custom-scrollbar"
        style={{
          paddingLeft: "16px",
          paddingRight: "16px",
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "rgba(255, 255, 255, 0.5) transparent", // For Firefox
        }}
      >
        {/* <div className="flex bg-white flex-col rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 h-[80vh] m-4 overflow-auto">
          <div className="flex justify-center border p-4">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <div className="overflow-y-auto h-full overflow-auto">{children}</div>
        </div> */}

        {/* style goes here */}
        <div className="flex justify-center">
          <div className="flex flex-col pb-16 text-center flex-nowrap w-1/2 bg-white rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 h-[80vh] m-4 overflow-auto">
            <div className="flex justify-center border p-4">
              <h1 className="text-2xl font-bold">Status Notifications</h1>
            </div>
            {/* Display multiple FaultCardUser components */}
            {visibleItems}
            {visibleItems}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNotificationsCardContainer;
