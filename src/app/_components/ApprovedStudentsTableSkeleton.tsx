import React from 'react';
import Skeleton from './Skeleton';

const ApprovedStudentsTableSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-lime-500 text-white">
          <tr>
            <th className="py-3 px-6 text-left font-semibold">STUDENT NUMBER</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-6">
                <Skeleton className="h-6 w-32" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovedStudentsTableSkeleton;