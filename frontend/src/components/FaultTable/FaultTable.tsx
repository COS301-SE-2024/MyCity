import React from 'react';
import { FaArrowUp, FaEye, FaCommentAlt } from 'react-icons/fa';

interface IncidentItems{
  asset_id : string,
  ticketnumber : string,
  address : string,
  upvotes : number,
  commentcount : number,
  viewcount : number,
}

interface IncidentItemsProps {
  tableitems: IncidentItems[];
}

const IncidentTable: React.FC<IncidentItemsProps> = ({tableitems}: IncidentItemsProps) => {
  

  return (
    <div className="text-white text-opacity-80 p-4">
      <div className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-lg text-white text-opacity-80 font-bold">
        <div className="col-span-1 flex justify-center">Urgency</div>
        <div className="col-span-1 flex justify-center">Ticket Number</div>
        <div className="col-span-1 flex justify-center">Fault Type</div>
        <div className="col-span-1 flex justify-center">Engagement</div>
        <div className="col-span-1 flex justify-center">Address</div>
      </div>
      {tableitems.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200"
        >
          <div className="col-span-1 flex justify-center text-red-500 font-bold">!</div>
          <div className="col-span-1 flex justify-center font-bold">{item.ticketnumber}</div>
          <div className="col-span-1 flex justify-center">{item.asset_id}</div>
          <div className="col-span-1 flex justify-center text-center">
            <div className="flex flex-col items-center">
              <div><FaArrowUp /></div>
              <div>{item.upvotes}k</div>
            </div>
            <div className="flex flex-col items-center ml-4">
              <div><FaEye /></div>
              <div>{item.viewcount}k</div>
            </div>
            <div className="flex flex-col items-center ml-4">
              <div><FaCommentAlt /></div>
              <div>{item.commentcount}</div>
            </div>
          </div>
 
          <div className="col-span-1 flex justify-center truncate">{item.address}</div>
        </div>
      ))}
    </div>
  );
  
};

export default IncidentTable;
