import React from 'react';
import { Check, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed m-0 inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div 
        className="bg-white rounded-lg shadow-lg p-6 z-[10000] w-[400px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center">
          <div className="bg-lime-100 p-3 rounded-full mb-4">
            <Check className="h-6 w-6 text-lime-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Success!</h2>
          <p className="text-center text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;