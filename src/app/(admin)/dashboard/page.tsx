'use client';

import React from 'react';
import OrgApprovalsTable from '~/app/_components/OrgApprovalsTable';
import ApprovedStudentsTable from '~/app/_components/ApprovedStudentsTable';

/**
 * Admin Dashboard Page
 * 
 * Central hub for administrative functions.
 * Contains two main components:
 * - Organization Approvals Table: Manages pending organization requests
 * - Approved Students Table: Displays and manages approved student list
 * 
 * Uses client-side rendering for real-time updates
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">DASHBOARD</h1>
      
      <section className="rounded-lg bg-white p-6 shadow">
        <OrgApprovalsTable />
      </section>

      <section className="rounded-lg bg-white p-6 shadow">
        <ApprovedStudentsTable />
      </section>
    </div>
  );
}
