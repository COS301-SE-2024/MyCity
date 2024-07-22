import React, { useRef, useEffect, useState } from 'react';

type Status = 'Fix in progress' | 'Unaddressed';

interface TenderType {
  id: string;
  ticketId: string;
  status: Status;
  serviceProvider: string;
  issueDate: string;
  price: number;
  estimatedDuration: number;
  upload: File | null;
}

const statusStyles = {
  'Unaddressed': 'border-blue-500 text-blue-500 bg-white',
  'Fix in progress': 'border-green-500 text-black bg-green-200',
};

export default function Tender({ tender }: { tender: TenderType }) {
  return (
    <>
      <div className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200">
        <div className="col-span-1 flex justify-center">
          <span className={`px-2 py-1 rounded border ${statusStyles[tender.status]}`}>
            {tender.status}
          </span>
        </div>
        <div className="col-span-1 flex justify-center font-bold">{tender.id}</div>
        <div className="col-span-1 flex justify-center">{tender.ticketId}</div>
        <div className="col-span-1 flex justify-center">{tender.serviceProvider}</div>
        <div className="col-span-1 flex justify-center">{tender.issueDate}</div>
        <div className="col-span-1 flex justify-center">R{tender.price.toFixed(2)}</div>
        <div className="col-span-1 flex justify-center">{tender.estimatedDuration} days</div>
      </div>
    </>
  );
}

