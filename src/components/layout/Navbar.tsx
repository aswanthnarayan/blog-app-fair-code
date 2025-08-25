'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // to show the underline
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  //to get nav link classes
  const getNavLinkClasses = (path: string) => {
    const baseClasses = "relative px-3 py-2 text-sm font-medium transition-colors duration-200";
    const activeClasses = "text-blue-600 border-b-2 border-blue-600";
    const inactiveClasses = "text-gray-700 hover:text-gray-900 hover:border-b-2 hover:border-gray-300";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Blog App
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <Link href="/" className={getNavLinkClasses('/')}>
              Home
            </Link>

            {user ? (
              <>
                <Link href="/create-post" className={getNavLinkClasses('/create-post')}>
                  Create Post
                </Link>
                <Link href="/profile" className={getNavLinkClasses('/profile')}>
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/users" className={getNavLinkClasses('/admin')}>
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name}
                  </span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
