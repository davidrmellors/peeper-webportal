import React from 'react';
import Navbar from '~/app/_components/navbar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow p-6">
        <h1 className="mb-6 text-4xl font-bold">DASHBOARD</h1>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;