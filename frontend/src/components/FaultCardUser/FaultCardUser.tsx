import React, { useState } from 'react';
import { FaArrowUp, FaEye, FaCommentAlt } from 'react-icons/fa';

interface FaultCardUserProps {
    title: string;
    address: string;
    arrowCount: number;
    commentCount: number;
    viewCount: number;
}

function formatNumber(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

const FaultCardUser: React.FC<FaultCardUserProps> = ({ title, address, arrowCount, commentCount, viewCount }) => {
    // Example state for dynamic colors on icons
    const [arrowColor, setArrowColor] = useState('black');
    const [commentColor, setCommentColor] = useState('black');
    const [eyeColor, setEyeColor] = useState('black');

    // Example click handlers to toggle icon colors
    const handleArrowClick = () => setArrowColor(arrowColor === 'black' ? 'blue' : 'black');
    const handleCommentClick = () => setCommentColor(commentColor === 'black' ? 'blue' : 'black');
    const handleEyeClick = () => setEyeColor(eyeColor === 'black' ? 'blue' : 'black');

    return (
        <div className="w-80 h-48 bg-white rounded-lg shadow-md overflow-hidden m-2">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-gray-700 text-base">{address}</p>
            </div>
            <div className="px-6 pt-4 pb-2 flex justify-between">
                <div className="flex flex-col items-center">
                    <div
                        className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                        style={{ color: arrowColor }}
                        onClick={handleArrowClick}
                    >
                        <FaArrowUp />
                    </div>
                    <span className="mt-2 text-gray-700">{formatNumber(arrowCount)}</span>
                </div>

                <div className="flex flex-col items-center">
                    <div
                        className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                        style={{ color: commentColor }}
                        onClick={handleCommentClick}
                    >
                        <FaCommentAlt />
                    </div>
                    <span className="mt-2 text-gray-700">{formatNumber(commentCount)}</span>
                </div>

                <div className="flex flex-col items-center">
                    <div
                        className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                        style={{ color: eyeColor }}
                        onClick={handleEyeClick}
                    >
                        <FaEye />
                    </div>
                    <span className="mt-2 text-gray-700">{formatNumber(viewCount)}</span>
                </div>
            </div>
        </div>
    );
};

export default FaultCardUser;
