import React, { useState, useEffect } from "react";
import FaultCardUser from "@/components/FaultCardUser/FaultCardUser";
import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";

interface CardData {
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  ticketNumber: string;
  description: string;
  image: string;
  createdBy: string;
}

const FaultCardContainer: React.FC = () => {
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

  // Placeholder card data for development, this will be replaced by an array of json objects of tickets from the database (see below)
  const cardData: CardData[] = [
    {
      title: "Pothole",
      address: "271 Berry Street, Birmingham",
      arrowCount: 10800,
      commentCount: 4900,
      viewCount: 873,
      ticketNumber: "SA1029",
      description: "There is a massive leakage... it’s flooding the streets and gardens.",
      image: "https://via.placeholder.com/300x150",
      createdBy: "Kyle Marshall"
    },
    {
      title: "Power Outage",
      address: "55 Elm Avenue, Manchester",
      arrowCount: 8500,
      commentCount: 3200,
      viewCount: 1200,
      ticketNumber: "PA1030",
      description: "There is a major power outage affecting the entire area.",
      image: "https://via.placeholder.com/300x150",
      createdBy: "Jane Doe"
    },
    {
      title: "Leaking Fire Hydrant",
      address: "123 Oak Lane, London",
      arrowCount: 12300,
      commentCount: 6700,
      viewCount: 2300,
      ticketNumber: "LF1031",
      description: "The fire hydrant is leaking and causing water wastage.",
      image: "https://via.placeholder.com/300x150",
      createdBy: "John Smith"
    },
    {
      title: "Gas Leak",
      address: "789 Maple Road, Liverpool",
      arrowCount: 9100,
      commentCount: 5400,
      viewCount: 1800,
      ticketNumber: "GL1032",
      description: "There is a gas leak that needs immediate attention.",
      image: "https://via.placeholder.com/300x150",
      createdBy: "Alice Johnson"
    },
    {
      title: "Water Main Break",
      address: "101 Pine Street, Glasgow",
      arrowCount: 13000,
      commentCount: 5000,
      viewCount: 2200,
      ticketNumber: "WM1033",
      description: "A water main break is causing significant flooding in the area.",
      image: "https://via.placeholder.com/300x150",
      createdBy: "Chris Evans"
    },
    {
      title: "Sinkhole",
      address: "89 Oakwood Drive, Sheffield",
      arrowCount: 15000,
      commentCount: 7200,
      viewCount: 3000,
      ticketNumber: "SH1034",
      description: "A large sinkhole has appeared in the middle of the street.",
      image: "https://via.placeholder.com/300x150",
      createdBy: "Natasha Romanoff"
    },
    {
      title: "Traffic Light Malfunction",
      address: "34 Elm Street, Edinburgh",
      arrowCount: 12000,
      commentCount: 6500,
      viewCount: 2700,
      ticketNumber: "TL1035",
      description: "The traffic lights at the intersection are malfunctioning.",
      image: "https://via.placeholder.com/300x150",
      createdBy: "Steve Rogers"
    },
    // Add more placeholder cards here if needed
  ];

  // Function to map JSON object to CardData interface
  // Essentially allows you to make one field in the JSON object
  // Correspond to a specific field in the CardData interface so it seemlessly
  // Works with the existing FaultCardUser component.

  const mapJsonToCardData = (json: any): CardData => {
    return {
      title: json.faultname, //e.g if the json object has a field 'faultname' which we want to show on frontend where the current title shows
      address: json.location,
      arrowCount: json.upvotes,
      commentCount: json.comments,
      viewCount: json.views,
      ticketNumber: json.ticket_id,
      description: json.description,
      image: json.image_url,
      createdBy: json.reported_by,
    };
  };

  // Backend engineers can replace this cardData array with their array from the database
  const [dynamicCardData, setDynamicCardData] = useState<CardData[]>(cardData);

   /* Uncomment and update the following useEffect to fetch data from the backend
   useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/cards'); // Replace with the actual API endpoint
        const data = await response.json();
        const mappedData = data.map((item: any) => mapJsonToCardData(item)); //use our mapping function to make the json object compatible with the CardData interface
        setDynamicCardData(mappedData);
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    }
    fetchData();
  }, []); */

  // Function to handle displaying the next set of items
  const showNextItems = () => {
    setStartIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  // Function to handle displaying the previous set of items
  const showPreviousItems = () => {
    setStartIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  // Calculate which items to display based on startIndex and itemsPerPage
  const visibleItems = dynamicCardData
    .slice(startIndex, startIndex + itemsPerPage)
    .map((item, index) => (
      <FaultCardUser
        key={startIndex + index}
        title={item.title}
        address={item.address}
        arrowCount={item.arrowCount}
        commentCount={item.commentCount}
        viewCount={item.viewCount}
        ticketNumber={item.ticketNumber}
        description={item.description}
        image={item.image}
        createdBy={item.createdBy}
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
          title={selectedCard.title}
          address={selectedCard.address}
          arrowCount={selectedCard.arrowCount}
          commentCount={selectedCard.commentCount}
          viewCount={selectedCard.viewCount}
          ticketNumber={selectedCard.ticketNumber}
          description={selectedCard.description}
          image={selectedCard.image}
          createdBy={selectedCard.createdBy}
        />
      )}
    </div>
  );
};

export default FaultCardContainer;
