import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-header">
        <img src="/path-to-logo.png" alt="Lekka Academy Logo" className="logo" />
        <h1>LEKKA ACADEMY</h1>
        <p>Community Service Tracking</p>
      </div>
      <div className="navbar-icons">
        <Link href="/profile">
          <img src="/path-to-profile-icon.png" alt="Profile" className="icon" />
        </Link>
        <Link href="/settings">
          <img src="/path-to-settings-icon.png" alt="Settings" className="icon" />
        </Link>
        <Link href="/notifications">
          <div className="notification-icon">
            <img src="/path-to-notification-icon.png" alt="Notifications" className="icon" />
            <span className="notification-badge">1</span>
          </div>
        </Link>
        <Link href="/messages">
          <img src="/path-to-message-icon.png" alt="Messages" className="icon" />
        </Link>
      </div>
      <ul className="navbar-menu">
        <li className="active">
          <Link href="/dashboard">DASHBOARD</Link>
        </li>
        <li>
          <Link href="/students">STUDENTS</Link>
        </li>
        <li>
          <Link href="/organisations">ORGANISATIONS</Link>
        </li>
        <li>
          <Link href="/reports">REPORTS</Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;