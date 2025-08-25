'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
  redirectTo = '/login',
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (adminOnly && user.role !== 'admin') {
        router.push('/');
        return;
      }
    }
  }, [user, loading, adminOnly, redirectTo, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to access this page.</p>
      </div>
    );
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return <>{children}</>;
};
