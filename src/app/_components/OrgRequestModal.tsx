import React from 'react';

interface OrgRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestDetails: any; // Replace with the appropriate type
  onApprove: () => void;
  onDeny: () => void;
}

const OrgRequestModal: React.FC<OrgRequestModalProps> = ({ isOpen, onClose, requestDetails, onApprove, onDeny }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold">{requestDetails.name}</h2>
        <p>Email: {requestDetails.email}</p>
        <p>Phone: {requestDetails.phoneNo}</p>
        <p>Address: {requestDetails.orgAddress.streetAddress}</p>
        {/* Add more details as needed */}
        
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onDeny} className="bg-red-500 text-white px-4 py-2 rounded">DENY</button>
          <button onClick={onApprove} className="bg-blue-500 text-white px-4 py-2 rounded">APPROVE</button>
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">CLOSE</button>
        </div>
      </div>
    </div>
  );
};

export default OrgRequestModal;