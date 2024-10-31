'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success('Logged out successfully');
      void router.push('/signin');
      void router.refresh(); // Refresh to clear any cached data
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">SETTINGS</h1>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Help Centre</h2>
          <div className="space-y-2">
            {['Terms and Conditions', 'Privacy Policy', 'Report a Bug'].map((item) => (
              <div key={item} className="flex items-center justify-between p-2 bg-white rounded-lg">
                <span>{item}</span>
                <ChevronRight />
              </div>
            ))}
          </div>
        </section>
      </div>

      <button
        onClick={() => void handleLogout()}
        disabled={isLoading}
        className="w-full py-3 bg-red-500 text-white rounded-lg font-bold 
          hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'LOGGING OUT...' : 'LOG OUT'}
      </button>
    </div>
  );
};

export default SettingsPage;