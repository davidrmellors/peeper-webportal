import React from 'react';
import Navbar from '~/app/_components/NavBar';
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;