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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const studentNumbers = new Set<string>();
        results.data.forEach((row: unknown) => {
          const studentNumber = (row as string[])[0]; // Assuming student numbers are in the first column
          if (typeof studentNumber === 'string' && /^ST\d{8}$/.test(studentNumber)) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Upload CSV</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">Cancel</button>
          <button onClick={handleUpload} className="bg-lime-500 text-white px-4 py-2 rounded">Upload</button>
        </div>
      </div>
    </div>
  );
};

export default UploadCSVModal;
