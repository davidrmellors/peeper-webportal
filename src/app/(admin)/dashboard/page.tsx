'use client';

import React from 'react';
import OrgApprovalsTable from '~/app/_components/OrgApprovalsTable';
import DashboardSkeleton from "~/app/_components/DashboardSkeleton";
import { Suspense } from "react";

const mockOrganizations = [
  { id: '1', name: 'Helping Hands', submittedBy: 'STXXXXXXXX', email: 'support@helpinghands.co.za', phoneNo: '+27 123 456 789' },
  { id: '2', name: 'Helping Hands', submittedBy: 'STXXXXXXXX', email: 'support@helpinghands.co.za', phoneNo: '+27 123 456 789' },
  { id: '3', name: 'Helping Hands', submittedBy: 'STXXXXXXXX', email: 'support@helpinghands.co.za', phoneNo: '+27 123 456 789' },
  { id: '4', name: 'Helping Hands', submittedBy: 'STXXXXXXXX', email: 'support@helpinghands.co.za', phoneNo: '+27 123 456 789' },
  { id: '5', name: 'Helping Hands', submittedBy: 'STXXXXXXXX', email: 'support@helpinghands.co.za', phoneNo: '+27 123 456 789' },
];

export default function DashboardPage() {
  const handleStudentApprove = (studentId: string) => {
    console.log(`Approved student with ID: ${studentId}`);
    // Implement student approval logic here
  };

  const handleStudentDeny = (studentId: string) => {
    console.log(`Denied student with ID: ${studentId}`);
    // Implement student denial logic here
  };

  const handleOrgApprove = (orgId: string) => {
    console.log(`Approved organization with ID: ${orgId}`);
    // Implement organization approval logic here
  };

  const handleOrgDeny = (orgId: string) => {
    console.log(`Denied organization with ID: ${orgId}`);
    // Implement organization denial logic here
  };

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">DASHBOARD</h1>
        
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 p-2 text-xl font-bold text-black">ORGANISATION APPROVALS</h2>
          <OrgApprovalsTable
            organizations={mockOrganizations}
            onApprove={handleOrgApprove}
            onDeny={handleOrgDeny}
          />
        </section>
      </div>
    </Suspense>
  );
}