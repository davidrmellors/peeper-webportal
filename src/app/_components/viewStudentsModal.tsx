import React from 'react';
import { X } from 'lucide-react';

interface viewStudentsModalProps {
  isOpen: boolean;
  students: string[];
  onClose: () => void;
}

const ViewStudentsModal: React.FC<viewStudentsModalProps> = ({
  isOpen,
  onClose,
  students,
}) => {
  
  if (!isOpen) return null;



  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" onClick={onClose}>
        <div 
          className="bg-white rounded-lg shadow-lg p-6 z-50 w-[400px] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 left-2 bg-red-500 rounded-full p-1 hover:bg-red-600 focus:outline-none"
          >
            <X size={16} className="text-white" />
          </button>
          <h2 className="text-2xl font-bold mb-2 text-center">Students</h2>

          <div className="space-y-2">   
            <div>
                {students.map((student_number: string, index: number) => (
                    <p key={index} className="text-center mb-2">{student_number.toUpperCase()}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewStudentsModal;
