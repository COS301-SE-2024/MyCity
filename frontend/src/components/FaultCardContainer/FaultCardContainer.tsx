import React, { useState } from 'react';
import FaultCardUser from '@/components/FaultCardUser/FaultCardUser';

const FaultCardContainer = () => {
    const [startIndex, setStartIndex] = useState(0); // Index to track the starting point of displayed items
    const itemsPerPage = 4; // Number of items to display per page
    const totalItems = 15; // Total number of items (you should calculate this dynamically in your application)

    // Example data for cards
    const cardData = [
        {
            title: 'Pothole 1',
            address: '271 Berry Street, Birmingham',
            arrowCount: '10.8k',
            commentCount: '4.9k',
            viewCount: '873',
        },
        {
            title: 'Pothole 2',
            address: '55 Elm Avenue, Manchester',
            arrowCount: '8.5k',
            commentCount: '3.2k',
            viewCount: '1.2k',
        },
        {
            title: 'Pothole 3',
            address: '123 Oak Lane, London',
            arrowCount: '12.3k',
            commentCount: '6.7k',
            viewCount: '2.3k',
        },
        {
            title: 'Pothole 4',
            address: '789 Maple Road, Liverpool',
            arrowCount: '9.1k',
            commentCount: '5.4k',
            viewCount: '1.8k',
        },
    ];

    // Function to handle displaying the next set of items
    const showNextItems = () => {
        setStartIndex(prevIndex => prevIndex + itemsPerPage);
    };

    // Function to handle displaying the previous set of items
    const showPreviousItems = () => {
        setStartIndex(prevIndex => prevIndex - itemsPerPage);
    };

    // Calculate which items to display based on startIndex and itemsPerPage
    const visibleItems = cardData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
        <FaultCardUser
            key={startIndex + index}
            title={item.title}
            address={item.address}
            arrowCount={item.arrowCount}
            commentCount={item.commentCount}
            viewCount={item.viewCount}
        />
    ));

    return (
        <div className="max-w-full overflow-hidden">
            <div className="relative w-full mb-8 flex flex-wrap">
                {/* Display multiple FaultCardUser components */}
                {visibleItems}
            </div>
            {/* Navigation buttons */}
            <div className="flex justify-center my-4">
                <button
                    className={`px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-300 ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={showPreviousItems}
                    disabled={startIndex === 0}
                >
                    Previous
                </button>
                <button
                    className={`px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-300 mx-4 ${startIndex + itemsPerPage >= totalItems ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={showNextItems}
                    disabled={startIndex + itemsPerPage >= totalItems}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default FaultCardContainer;
