'use client';

import React from 'react';
import OrgApprovalsTable from '~/app/_components/OrgApprovalsTable';

export default function DashboardPage() {

  return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">DASHBOARD</h1>
        
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 p-2 text-xl font-bold text-black">ORGANISATION APPROVALS</h2>
          <OrgApprovalsTable
          />
        </section>
      </div>
  );
}
