import React, { useState } from 'react';
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';
import ApprovedStudentsTableSkeleton from './ApprovedStudentsTableSkeleton';
import UploadCSVModal from './UploadCSVModal';
import SuccessModal from './SuccessModal';

/**
 * Approved Students Table Component
 * 
 * Displays and manages the list of approved students.
 * Features:
 * - CSV upload functionality for bulk student addition
 * - Real-time data updates using tRPC
 * - Success notifications
 * - Loading state handling
 * - Responsive table design
 */
const ApprovedStudentsTable: React.FC = () => {
  const router = useRouter();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  const { data: approvedStudents, isLoading } = api.approvedStudents.fetchAllApprovedStudents.useQuery();
  const addApprovedStudentsMutation = api.approvedStudents.addApprovedStudents.useMutation();
  const utils = api.useUtils();

  const handleUploadStudentNumbers = (studentNumbers: string[]) => {
    console.log('Uploaded Student Numbers:', studentNumbers);
    addApprovedStudentsMutation.mutate({ approvedStudents: studentNumbers }, {
      onSuccess: () => {
        setSuccessModalOpen(true);
        setUploadModalOpen(false);
        void utils.approvedStudents.fetchAllApprovedStudents.invalidate();
        setTimeout(() => {
          void router.refresh();
        }, 1500);
      }
    });
  };

  if (isLoading) {
    return <ApprovedStudentsTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-black">APPROVED STUDENTS</h2>
        <button 
          onClick={() => setUploadModalOpen(true)} 
          className="bg-lime-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          ADD STUDENTS
        </button>
      </div>

      {!approvedStudents?.length ? (
        <div className="text-center py-4">
          <p className="text-gray-600">No approved students found.</p>
          <p className="text-sm text-gray-500 mt-2">Approved students will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-lime-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">STUDENT NUMBER</th>
              </tr>
            </thead>
            <tbody>
              {approvedStudents.map((studentNumber, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{studentNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UploadCSVModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadStudentNumbers}
      />
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Students have been successfully added to the approved list."
      />
    </div>
  );
};

export default ApprovedStudentsTable;
