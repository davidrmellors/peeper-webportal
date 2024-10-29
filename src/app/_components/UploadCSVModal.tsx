import React, { useState } from 'react';
import Papa from 'papaparse';

interface UploadCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (studentNumbers: string[]) => void;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [studentNumber, setStudentNumber] = useState('');
  const [addedStudents, setAddedStudents] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');

  const validateStudentNumber = (number: string): boolean => {
    return /^ST\d{8}$/i.test(number.toUpperCase());
  };

  const handleAddStudent = () => {
    const formattedNumber = studentNumber.toUpperCase();
    if (!validateStudentNumber(formattedNumber)) {
      setError('Invalid student number format. Must be ST followed by 8 digits.');
      return;
    }
    
    setAddedStudents(prev => new Set([...prev, formattedNumber]));
    setStudentNumber('');
    setError(null);
  };

  const handleRemoveStudent = (number: string) => {
    setAddedStudents(prev => {
      const newSet = new Set(prev);
      newSet.delete(number);
      return newSet;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUploadCSV = () => {
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const studentNumbers = new Set<string>();
        results.data.forEach((row: unknown) => {
          const studentNumber = ((row as string[])[0] || '').toUpperCase();
          if (validateStudentNumber(studentNumber)) {
            studentNumbers.add(studentNumber);
          }
        });
        onUpload(Array.from(studentNumbers));
        onClose();
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const handleSubmit = () => {
    if (activeTab === 'csv' && file) {
      handleUploadCSV();
    } else {
      onUpload(Array.from(addedStudents));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">Add Students</h2>
        
        <div className="flex mb-4 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'manual' ? 'border-b-2 border-lime-500 text-lime-500' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Entry
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'csv' ? 'border-b-2 border-lime-500 text-lime-500' : ''}`}
            onClick={() => setActiveTab('csv')}
          >
            CSV Upload
          </button>
        </div>

        {activeTab === 'manual' ? (
          <div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="Enter student number (e.g., ST12345678)"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleAddStudent}
                className="bg-lime-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {addedStudents.size > 0 && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">Added Students:</h3>
                <div className="max-h-[200px] overflow-y-auto">
                  {Array.from(addedStudents).map((number) => (
                    <div key={number} className="flex justify-between items-center p-2 bg-gray-50 mb-1 rounded">
                      <span>{number}</span>
                      <button
                        onClick={() => handleRemoveStudent(number)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <input type="file" accept=".csv" onChange={handleFileChange} className="mb-2" />
            <p className="text-sm text-gray-500">Upload a CSV file with student numbers in the first column</p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-lime-500 text-white px-4 py-2 rounded"
            disabled={activeTab === 'manual' ? addedStudents.size === 0 : !file}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCSVModal;
