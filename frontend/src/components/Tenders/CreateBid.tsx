import React, { useState } from 'react';

interface Ticket {
  id: string;
  faultType: string;
  description: string;
  address: string;
  municipalityImage: string;
}

interface CreateBidProps {
  ticket: Ticket;
  onBack: () => void;
}

const CreateBid: React.FC<CreateBidProps> = ({ ticket, onBack }) => {
  const [proposedPrice, setProposedPrice] = useState<string>('0.00');
  const [jobDuration, setJobDuration] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    if (!isNaN(Number(value))) {
      value = parseFloat(value).toFixed(2);
      setProposedPrice(value);
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setJobDuration(value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto flex flex-col lg:flex-row">
      <div className="flex-1 p-4">
        <img src={ticket.municipalityImage} alt="Municipality" className="w-16 h-16 rounded-full mb-4 mx-auto" />
        <h2 className="text-xl font-bold mb-2 text-center">Fault #{ticket.id}</h2>
        <p className="text-lg font-semibold mb-2 text-center">{ticket.faultType}</p>
        <p className="text-md mb-4 text-center">&quot;{ticket.description}&quot;</p>
        <div className="mb-4 text-center">
          <p className="text-lg font-semibold">Fault Address</p>
          <p>{ticket.address}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-1" htmlFor="proposedPrice">Proposed Price</label>
            <div className="relative">
              <span className="absolute left-0 top-0 bottom-0 flex items-center pl-2">R</span>
              <input
                type="text"
                id="proposedPrice"
                value={proposedPrice}
                onChange={handlePriceChange}
                className="w-full pl-6 pr-2 py-1 border rounded"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-1" htmlFor="jobDuration">Job Duration</label>
            <div className="relative">
              <input
                type="text"
                id="jobDuration"
                value={jobDuration}
                onChange={handleDurationChange}
                className="w-full pl-2 pr-10 py-1 border rounded"
                placeholder="Days"
              />
              <span className="absolute right-0 top-0 bottom-0 flex items-center pr-2">days</span>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold mb-1">Other Relevant Information</p>
            <div className="border-dashed border-2 border-gray-400 rounded-lg p-4">
              <input
                type="file"
                onChange={handleFileUpload}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-8">
            <button
              type="button"
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300"
              onClick={onBack}
            >
              Back
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Submit</button>
          </div>
        </form>
      </div>
      <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center p-4">
        <div className="w-full h-full text-gray-500">
          <p className="text-center">Map Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default CreateBid;
