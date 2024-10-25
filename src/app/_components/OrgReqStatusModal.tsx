import React from 'react';

interface OrgRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvalStatus: boolean;
}

const OrgReqStatusModal: React.FC<OrgRequestModalProps> = ({ isOpen, approvalStatus, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold">{approvalStatus ? "Successfully Approved Organisation" : "Successfully Denied Organisation"}</h2>
        <div className="flex justify-center space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">CLOSE</button>
        </div>
      </div>
    </div>
  );
};

export default OrgReqStatusModal;