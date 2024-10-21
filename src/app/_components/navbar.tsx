import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
  return (
    <nav className="flex flex-col w-64 h-screen bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <Image src="/lekka-academy-logo.png" alt="Lekka Academy Logo" width={150} height={50} />
        <h1 className="text-xl font-bold mt-2">LEKKA ACADEMY</h1>
        <p className="text-sm text-gray-600">Community Service Tracking</p>
      </div>
      
      <div className="flex-grow">
        <ul className="mt-4">
          <NavItem href="/" label="DASHBOARD" active />
          <NavItem href="/students" label="STUDENTS" />
          <NavItem href="/organisations" label="ORGANISATIONS" />
          <NavItem href="/reports" label="REPORTS" />
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between">
          <NavIcon href="/profile" src="/profile-icon.png" alt="Profile" />
          <NavIcon href="/settings" src="/settings-icon.png" alt="Settings" />
          <NavIcon href="/notifications" src="/notifications-icon.png" alt="Notifications" badge="1" />
          <NavIcon href="/messages" src="/messages-icon.png" alt="Messages" />
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ href: string; label: string; active?: boolean }> = ({ href, label, active }) => (
  <li className={`mb-2 ${active ? 'bg-purple-100' : ''}`}>
    <Link href={href} className={`block px-4 py-2 ${active ? 'text-purple-700 font-bold' : 'text-gray-700'}`}>
      {label}
    </Link>
  </li>
);

const NavIcon: React.FC<{ href: string; src: string; alt: string; badge?: string }> = ({ href, src, alt, badge }) => (
  <Link href={href} className="relative">
    <Image src={src} alt={alt} width={24} height={24} />
    {badge && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
);

export default Navbar;