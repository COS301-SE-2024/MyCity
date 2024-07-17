import React from 'react';
import { AlertCircle } from 'lucide-react';

type Urgency = 'high' | 'medium' | 'low';
type Status = 'Fix in progress' | 'Unaddressed';

interface RecordType {
  id: string;
  faultType: string;
  status: Status;
  createdBy: string;
  address: string;
  urgency: Urgency;
}

interface UrgencyMappingType {
  [key: string]: { icon: JSX.Element, label: string };
}

interface StatusMappingType {
  [key: string]: string;
}

const statusMapping: StatusMappingType = {
  'Fix in progress': 'Tender Contract',
  'Unaddressed': 'View Tenders'
};

const urgencyMapping: UrgencyMappingType = {
  high: { icon: <AlertCircle className="text-red-500" />, label: 'Urgent' },
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: 'Moderate' },
  low: { icon: <AlertCircle className="text-green-500" />, label: 'Not Urgent' }
};

export default function Record({ record }: { record: RecordType }) {
  const urgency = urgencyMapping[record.urgency] || urgencyMapping.low;

  return (
    <div className="grid grid-cols-7 gap-4 items-center mb-2 px-2 py-1 rounded-lg bg-white bg-opacity-70 text-black border-b border-gray-200">
      <div className="col-span-1 flex justify-center">{urgency.icon}</div>
      <div className="col-span-1 flex justify-center font-bold">{record.id}</div>
      <div className="col-span-1 flex justify-center">{record.faultType}</div>
      <div className="col-span-1 flex justify-center">
        <span className={`px-2 py-1 rounded ${record.status === 'Unaddressed' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
          {record.status}
        </span>
      </div>
      <div className="col-span-1 flex justify-center">{record.createdBy}</div>
      <div className="col-span-1 flex justify-center truncate">{record.address}</div>
      <div className="col-span-1 flex justify-center">
        <a href="#" className="text-blue-500 underline">
          {statusMapping[record.status]}
        </a>
      </div>
    </div>
  );
}
