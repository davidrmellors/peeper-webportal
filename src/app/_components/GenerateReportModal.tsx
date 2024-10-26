import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Student } from '../../server/db/databaseClasses/Student';
import { api } from '~/trpc/react';
import { generatePDFReports } from '~/utils/pdfConverter';
import { Progress } from '~/components/ui/progress';

interface GenerateReportModalProps {
  isOpen: boolean;
  selectedStudents: Student[];
  onClose: () => void;
  onGenerate: (selectedStudents: Student[], fileType: 'xlsx' | 'pdf') => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  selectedStudents,
}) => {
  const generateExcel = api.student.generateExcelReport.useMutation();
  const [fileType, setFileType] = useState<'xlsx' | 'pdf'>('xlsx');
  const [progress, setProgress] = useState(0);
  
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

  const handleSubmit = async () => {
    if (fileType === 'xlsx') {
      void handleDownloadExcel();
      onClose();
    } else {
      try {
        setProgress(0);
        // Simulate progress for PDF generation
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 500);

        const blob = await generatePDFReports(selectedStudents);
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedStudents.length === 1 && selectedStudents[0]?.studentNumber
          ? `${selectedStudents[0].studentNumber}_report.pdf`
          : 'student_reports.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          onClose();
          setProgress(0);
        }, 1000);
      } catch (error) {
        console.error('Error generating PDF:', error);
        setProgress(0);
      }
    }
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

          {fileType === 'pdf' && progress > 0 && (
            <div className="mt-6">
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Generating PDF{selectedStudents.length > 1 ? 's' : ''}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-2 bg-lime-500 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={progress > 0 && progress < 100}
          >
            {progress > 0 && progress < 100 ? 'GENERATING...' : 'GENERATE'}
          </button>
        </div>
      </div>
    </>
  );
};

export default GenerateReportModal;
