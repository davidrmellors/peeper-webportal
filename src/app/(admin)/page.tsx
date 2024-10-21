'use client';

import React from 'react';
import StudentApprovalsTable from '~/app/_components/StudentApprovalsTable';
import OrgApprovalsTable from '~/app/_components/OrgApprovalsTable';

// Mock data for demonstration
const mockStudents = [
  { id: '1', name: 'John Doe', email: 'STXXXXXXXX@lekkaacademy.co.za' },
  { id: '2', name: 'Jane Doe', email: 'STXXXXXXXX@lekkaacademy.co.za' },
  { id: '3', name: 'Alice Smith', email: 'STXXXXXXXX@lekkaacademy.co.za' },
  { id: '4', name: 'Bob Johnson', email: 'STXXXXXXXX@lekkaacademy.co.za' },
  { id: '5', name: 'Charlie Brown', email: 'STXXXXXXXX@lekkaacademy.co.za' },
];

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
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 bg-lime-500 p-2 text-xl font-bold text-white">STUDENT APPROVALS</h2>
        <StudentApprovalsTable
          students={mockStudents}
          onApprove={handleStudentApprove}
          onDeny={handleStudentDeny}
        />
      </section>
      
      <section className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 bg-lime-500 p-2 text-xl font-bold text-white">ORGANISATION APPROVALS</h2>
        <OrgApprovalsTable
          organizations={mockOrganizations}
          onApprove={handleOrgApprove}
          onDeny={handleOrgDeny}
        />
      </section>
    </div>
  );
}