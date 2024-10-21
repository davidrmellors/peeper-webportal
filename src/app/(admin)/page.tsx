import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 bg-lime-500 p-2 text-xl font-bold text-white">STUDENT APPROVALS</h2>
        {/* StudentApprovalsTable component will be added here */}
      </section>
      
      <section className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 bg-lime-500 p-2 text-xl font-bold text-white">ORGANISATION APPROVALS</h2>
        {/* OrganisationApprovalsTable component will be added here */}
      </section>
    </div>
  );
};

export default DashboardPage;