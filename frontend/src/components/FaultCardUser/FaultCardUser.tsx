import React, { useState } from 'react';
import { FaArrowUp, FaEye, FaCommentAlt } from 'react-icons/fa';

const FaultCardUser = ({ title, address, arrowCount, commentCount, viewCount }) => {
    // Example state for dynamic colors on icons
    const [arrowColor, setArrowColor] = useState('black');
    const [commentColor, setCommentColor] = useState('black');
    const [eyeColor, setEyeColor] = useState('black');

    // Example click handlers to toggle icon colors
    const handleArrowClick = () => setArrowColor(arrowColor === 'black' ? 'blue' : 'black');
    const handleCommentClick = () => setCommentColor(commentColor === 'black' ? 'blue' : 'black');
    const handleEyeClick = () => setEyeColor(eyeColor === 'black' ? 'blue' : 'black');

    return (
        <div className="max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white rounded-lg shadow-md overflow-hidden m-2">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-gray-700 text-base">{address}</p>
            </div>
            <div className="px-6 pt-4 pb-2 flex justify-between">
                <div className="flex items-center">
                    <FaArrowUp
                        className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                        style={{ color: arrowColor }}
                        onClick={handleArrowClick}
                    />
                    <span className="ml-2 text-gray-700">{arrowCount}</span>
                </div>
                <div className="flex items-center">
                    <FaCommentAlt
                        className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                        style={{ color: commentColor }}
                        onClick={handleCommentClick}
                    />
                    <span className="ml-2 text-gray-700">{commentCount}</span>
                </div>
                <div className="flex items-center">
                    <FaEye
                        className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                        style={{ color: eyeColor }}
                        onClick={handleEyeClick}
                    />
                    <span className="ml-2 text-gray-700">{viewCount}</span>
                </div>
            </div>
        </div>
    );
};

export default FaultCardUser;
