import React from 'react';
import Skeleton from './Skeleton';

const StudentsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-lime-500 text-white">
            <tr>
              <th className="p-2 w-0"></th>
              <th className="p-2 text-left w-1/3">STUDENT NUMBER</th>
              <th className="p-2 text-left w-1/4">HOURS</th>
              <th className="p-2 text-left w-1/5">STATUS</th>
              <th className="p-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 20 } as { length: number }).map((_, i) => (
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

export default StudentsSkeleton;
