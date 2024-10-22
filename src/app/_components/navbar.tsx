'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building2, FileBarChart, User, Settings, Bell, MessageSquare } from 'lucide-react';
import { usePrefetch } from '~/app/api/hooks/usePrefetch';

const Navbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('/');
  const pathname = usePathname();

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  return (
    <nav className="flex flex-col w-64 h-screen bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        {/* <Image src="/lekka-academy-logo.png" alt="Lekka Academy Logo" width={150} height={50} /> */}
        <h1 className="text-xl font-bold mt-2">LEKKA ACADEMY</h1>
        <p className="text-sm text-gray-600">Community Service Tracking</p>
      </div>
      
      <div className="flex-grow">
        <ul className="mt-4">
          <NavItem href="/dashboard" label="DASHBOARD" icon={LayoutDashboard} active={activeItem === '/dashboard'} />
          <NavItem href="/students" label="STUDENTS" icon={Users} active={activeItem === '/students'} />
          <NavItem href="/organisations" label="ORGANISATIONS" icon={Building2} active={activeItem === '/organisations'} />
          <NavItem href="/reports" label="REPORTS" icon={FileBarChart} active={activeItem === '/reports'} />
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between">
          <NavIcon href="/profile" icon={User} />
          <NavIcon href="/settings" icon={Settings} />
          <NavIcon href="/notifications" icon={Bell} badge="1" />
          <NavIcon href="/messages" icon={MessageSquare} />
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ href: string; label: string; icon: React.ElementType; active: boolean }> = ({ href, label, icon: Icon, active }) => {
  const { prefetchOrganisations, prefetchStudents } = usePrefetch();

  const handleMouseEnter = () => {
    if (label === 'ORGANISATIONS') {
      prefetchOrganisations();
    } else if (label === 'STUDENTS') {
      prefetchStudents();
    }
  };

  return (
    <li className={`mb-2 ${active ? 'bg-lime-500' : ''}`} onMouseEnter={handleMouseEnter}>
      <Link href={href} className={`flex items-center px-4 py-2 ${active ? 'text-white font-bold' : 'text-gray-700'}`}>
        <Icon className="mr-2" size={24} />
        {label}
      </Link>
    </li>
  );
};

const NavIcon: React.FC<{ href: string; icon: React.ElementType; badge?: string }> = ({ href, icon: Icon, badge }) => (
  <Link href={href} className="relative">
    <Icon size={24} />
    {badge && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
);

export default Navbar;