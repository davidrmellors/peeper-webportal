import React from 'react';
import { Edit, FileText, Trash2, X } from 'lucide-react';

interface StudentActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onGenerateReport: () => void;
  onDelete: () => void;
}

const StudentActionModal: React.FC<StudentActionModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onGenerateReport,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50 w-[400px] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 left-2 bg-red-500 rounded-full p-1 hover:bg-red-600 focus:outline-none"
        >
          <X size={16} className="text-white" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Student Actions</h2>
        <button
          onClick={onEdit}
          className="w-full mb-2 px-4 py-2 text-left flex items-center hover:bg-gray-100 rounded-lg"
        >
          <Edit className="mr-2 h-4 w-4" />
          EDIT
        </button>
        <button
          onClick={onGenerateReport}
          className="w-full mb-2 px-4 py-2 text-left flex items-center hover:bg-gray-100 rounded-lg"
        >
          <FileText className="mr-2 h-4 w-4" />
          GENERATE REPORT
        </button>
        <button
          onClick={onDelete}
          className="w-full mb-2 px-4 py-2 text-left flex items-center text-red-500 hover:bg-gray-100 rounded-lg"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          DELETE
        </button>
      </div>
    </>
  );
};

export default StudentActionModal;
