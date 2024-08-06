import React, { useState } from "react";
import StatusCardUser from "@/components/StatusCardUser/StatusCardUser";
import UpvoteCardUser from "@/components/UpvoteCardUser/UpvoteCardUser";

interface cardDataWatchlist {
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

interface cardDataUpvotes {
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
  cardDataWatchlist: cardDataWatchlist[];
  cardDataUpvotes: cardDataUpvotes[];
}


const DashboardNotificationsCardContainer: React.FC<CardComponentProps> = ({
  cardDataWatchlist = [],
  cardDataUpvotes = [],
}) => {
  const [startIndex, setStartIndex] = useState(0); // Index to track the starting point of displayed items
  const itemsPerPage = 7; // Number of items to display per page
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<cardDataWatchlist | null>(null);

  const handleCardClick = (cardDataWatchlist: cardDataWatchlist) => {
    setSelectedCard(cardDataWatchlist);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  // Function to handle displaying the next set of items
  const showNextItems = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerPage, cardDataWatchlist.length - itemsPerPage)
    );
  };

  // Function to handle displaying the previous set of items
  const showPreviousItems = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  // Calculate which items to display based on startIndex and itemsPerPage
  const UpvoteNotifications = cardDataUpvotes
    .slice(startIndex, Math.min(startIndex + itemsPerPage, cardDataUpvotes.length))
    .map((item, index) => (
      <UpvoteCardUser
        key={item.ticket_id}
        title={item.asset_id}
        address={item.address}
        arrowCount={item.upvotes}
        commentCount={item.commentcount}
        viewCount={item.viewcount}
        image={item.imageURL}
        municipality_id={item.municipality_id}
        state={item.state}
        onClick={() => handleCardClick(item)}
      />
    ));

    const WatchlistNotifications = cardDataWatchlist
    .slice(startIndex, Math.min(startIndex + itemsPerPage, cardDataWatchlist.length))
    .map((item, index) => (
      <StatusCardUser
        key={item.ticket_id}
        title={item.asset_id}
        address={item.address}
        arrowCount={item.upvotes}
        commentCount={item.commentcount}
        viewCount={item.viewcount}
        image={item.imageURL}
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
        {/* style goes here */}
        <div className="flex justify-center">
          <div className="flex flex-col pb-16 text-center flex-nowrap w-1/2 bg-white rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 h-[80vh] m-4 overflow-auto">
            <div className="flex justify-center border p-4">
              <h1 className="text-2xl font-bold">Status Notifications</h1>
            </div>
            {/* Display multiple FaultCardUser components */}
            {WatchlistNotifications}
            {UpvoteNotifications}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNotificationsCardContainer;
