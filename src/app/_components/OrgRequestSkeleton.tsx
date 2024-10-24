import React from 'react';
import Skeleton from './Skeleton';

const OrgRequestSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-lime-500 text-white">
            <tr>
              <th className="p-2 w-0"></th>
              <th className="p-2 text-left w-1/3">NAME</th>
              <th className="p-2 text-left w-1/4">SUBMITTED BY</th>
              <th className="p-2 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 } as { length: number }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="p-2"><Skeleton className="h-5 w-5 rounded" /></td>
                <td className="p-2"><Skeleton className="h-6 w-full" /></td>
                <td className="p-2"><Skeleton className="h-6 w-full" /></td>
                <td className="p-2"><Skeleton className="h-6 w-full" /></td>
                <td className="p-2"><Skeleton className="h-8 w-20" /></td>
                <td className="p-2"><Skeleton className="h-6 w-6" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrgRequestSkeleton;
