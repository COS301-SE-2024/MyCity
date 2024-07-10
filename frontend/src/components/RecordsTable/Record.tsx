import { AlertCircle} from 'lucide-react';

// Define types for the urgency and status mappings
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
        <tr className="border border-gray-500 rounded-lg text-white bg-transparent">
            <td className="py-2 px-4 text-center">
                {urgency.icon}
            </td>
            <td className="py-2 px-4 text-center">{record.id}</td>
            <td className="py-2 px-4 text-center">{record.faultType}</td>
            <td className="py-2 px-4 text-center">
                <span className={`px-2 py-1 rounded ${record.status === 'Unaddressed' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                    {record.status}
                </span>
            </td>
            <td className="py-2 px-4 text-center">{record.createdBy}</td>
            <td className="py-2 px-4 text-center">{record.address}</td>
            <td className="py-2 px-4 text-center">
                <a href="#" className="text-blue-500 underline">
                    {statusMapping[record.status]}
                </a>
            </td>
        </tr>
    );
}
