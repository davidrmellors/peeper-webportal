import React from 'react';
import Skeleton from './Skeleton';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/3" /> {/* Dashboard title */}

      {/* Student Approvals Section */}
      <div className="rounded-lg bg-white p-6 shadow">
        <Skeleton className="mb-4 h-6 w-1/4" /> {/* Section title */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-1/4" /> {/* Name */}
              <Skeleton className="h-10 w-1/3" /> {/* Email */}
              <Skeleton className="h-10 w-20" /> {/* Approve button */}
              <Skeleton className="h-10 w-20" /> {/* Deny button */}
            </div>
          ))}
        </div>
      </div>

      {/* Organisation Approvals Section */}
      <div className="rounded-lg bg-white p-6 shadow">
        <Skeleton className="mb-4 h-6 w-1/4" /> {/* Section title */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-1/5" /> {/* Name */}
              <Skeleton className="h-10 w-1/5" /> {/* Submitted By */}
              <Skeleton className="h-10 w-1/4" /> {/* Email */}
              <Skeleton className="h-10 w-1/5" /> {/* Phone */}
              <Skeleton className="h-10 w-20" /> {/* Approve button */}
              <Skeleton className="h-10 w-20" /> {/* Deny button */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
