import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Student } from '../../server/db/databaseClasses/Student';
import { api } from '~/trpc/react';

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
  const generateExcel = api.student.generateExcelReport.useMutation();
  const [fileType, setFileType] = useState<'xlsx' | 'pdf'>('xlsx');

  if (!isOpen) return null;

  const handleDownloadExcel = async() =>{
    if(selectedStudents.length === 0) return;
    try {
      const studentIds = selectedStudents.map(student => student.student_id);
      const base64Data = await generateExcel.mutateAsync(studentIds);

      //Convert base64 to blob
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for(let i = 0; i< binaryString.length; i++){
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      
      //Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student-hours.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch(error: unknown) {
      console.error('Error downloading Excel:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  const handleSubmit = () => {
    if(fileType === 'xlsx') void handleDownloadExcel();
    //else PDFShareFunctionality
    onGenerate(selectedStudents, fileType);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 z-50 w-[400px] relative">
        <h2 className="text-2xl font-bold mb-6">GENERATE REPORT</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <p className="text-gray-600 mb-6">Generate community service report</p>

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
    </>
  );
};

export default GenerateReportModal;
