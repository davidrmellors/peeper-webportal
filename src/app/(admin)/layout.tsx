import React from 'react';
import Navbar from '~/app/_components/navbar';
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <div className="w-full lg:w-64 lg:min-h-screen">
        <Navbar />
      </div>
      <main className="flex-grow p-4 sm:p-6 overflow-x-auto">
        <div className="max-w-10xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;