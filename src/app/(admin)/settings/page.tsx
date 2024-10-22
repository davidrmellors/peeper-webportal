'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // Implement dark mode logic here
  };

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/sign-in');
  };

  const handleDataDeletion = () => {
    // Implement data deletion request logic here
    console.log('Data deletion requested');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">SETTINGS</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Personalisation</h2>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <button
            onClick={handleDarkModeToggle}
            className={`w-12 h-6 rounded-full p-1 ${
              darkMode ? 'bg-lime-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                darkMode ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </section>

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

      <button
        onClick={handleDataDeletion}
        className="w-full py-3 bg-lime-500 text-white rounded-lg font-bold"
      >
        REQUEST DATA DELETION
      </button>

      <button
        onClick={handleLogout}
        className="w-full py-3 bg-red-500 text-white rounded-lg font-bold"
      >
        LOG OUT
      </button>
    </div>
  );
};

export default SettingsPage;