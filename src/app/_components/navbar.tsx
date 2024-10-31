'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Users, Building2, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useClerk();
  const router = useRouter();

  const links = [
    { href: '/dashboard', label: 'DASHBOARD', icon: <LayoutDashboard size={20} /> },
    { href: '/students', label: 'STUDENTS', icon: <Users size={20} /> },
    { href: '/organisations', label: 'ORGANISATIONS', icon: <Building2 size={20} /> },
    { href: '/settings', label: 'SETTINGS', icon: <Settings size={20} /> },
  ];

  const handleSignOut = async () => {
    await signOut(() => router.push('/'));
  };

  const currentPage = links.find(link => pathname === link.href)?.label ?? 'DASHBOARD';

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <h1 className="text-xl font-bold">{currentPage}</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40 lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex flex-col pt-16">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-3 ${
                      pathname === link.href
                        ? 'bg-lime-500 text-white'
                        : 'text-gray-600 hover:bg-lime-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto">
                <button
                  onClick={handleSignOut}
                  className="mb-8 mx-6 py-4 px-6 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3"
                >
                  <LogOut size={20} />
                  LOGOUT
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-screen fixed w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Peeper</h1>
        </div>
        <div className="flex flex-col flex-grow">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-3 ${
                pathname === link.href
                  ? 'bg-lime-500 text-white'
                  : 'text-gray-600 hover:bg-lime-50'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <div className="mt-auto">
            <button
              onClick={handleSignOut}
              className="mb-8 mx-6 mt-2 py-4 px-6 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3"
            >
              <LogOut size={20} />
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;