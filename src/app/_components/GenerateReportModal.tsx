import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Student } from '../../server/db/databaseClasses/Student';

interface GenerateReportModalProps {
  isOpen: boolean;
  selectedStudents: Student[];
  onClose: () => void;
  onGenerate: (selectedStudents: Student[], fileType: 'xlsx' | 'pdf') => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  selectedStudents,
}) => {
    
  const [fileType, setFileType] = useState<'xlsx' | 'pdf'>('xlsx');

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log('Generating report:', {
        selectedStudents: selectedStudents,
        fileType
      });
    onGenerate(selectedStudents, fileType);
    onClose();
  };

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
          <h2 className="text-2xl font-bold mb-6 text-center">GENERATE REPORT</h2>

          <p className="text-gray-600 text-center mb-6">Generate community service report</p>

          <div className="space-y-4">
            <div>
              <p className="text-center mb-2">Select file type</p>
              <div className="flex justify-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={fileType === 'xlsx'}
                    onChange={() => setFileType('xlsx')}
                    className="mr-2"
                  />
                  xlsx
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={fileType === 'pdf'}
                    onChange={() => setFileType('pdf')}
                    className="mr-2"
                  />
                  pdf
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-2 bg-lime-500 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            GENERATE
          </button>
        </div>
      </div>
    </>
  );
};

export default GenerateReportModal;
