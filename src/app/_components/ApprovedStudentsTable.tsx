import React from 'react';
import { api } from "~/trpc/react";
import ApprovedStudentsTableSkeleton from './ApprovedStudentsTableSkeleton';

const ApprovedStudentsTable: React.FC = () => {
  const { data: approvedStudents, isLoading } = api.approvedStudents.fetchAllApprovedStudents.useQuery();
  console.log(approvedStudents);

  if (isLoading) {
    return <ApprovedStudentsTableSkeleton />;
  }

  if (!approvedStudents?.length) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">No approved students found.</p>
        <p className="text-sm text-gray-500 mt-2">Approved students will appear here.</p>
      </div>
    );
  }

  return (
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
  );
};

export default ApprovedStudentsTable;
