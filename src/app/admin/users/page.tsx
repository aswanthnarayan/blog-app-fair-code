'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { usersApi } from '@/lib/api';
import { User } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const router = useRouter();
  const {
    isOpen: isConfirmModalOpen,
    options: confirmOptions,
    loading: confirmLoading,
    showConfirmation,
    handleConfirm,
    handleClose,
  } = useConfirmationModal();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await usersApi.getAllUsers();
      setUsers(fetchedUsers);
      setError('');
    } catch (err: any) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserPosts = (userData: User) => {
    // Navigate to a filtered view of posts by this user
    router.push(`/admin/users/${userData._id || userData.id}/posts`);
  };

  const handleDeleteUser = (userData: User) => {
    const userName = userData.name || userData.email;
    showConfirmation(
      {
        title: 'Delete User',
        message: `Are you sure you want to delete user "${userName}"? This action cannot be undone and will permanently remove the user and all their data.`,
        confirmText: 'Delete User',
        cancelText: 'Cancel',
        type: 'danger',
      },
      async () => {
        try {
          await usersApi.deleteUser(userData._id || userData.id);
          // Refresh the users list
          await fetchUsers();
          // You could add a toast notification here instead of alert
        } catch (error: any) {
          console.error('Error deleting user:', error);
          // You could add error toast notification here
          throw error; // Re-throw to keep modal open on error
        }
      }
    );
  };

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchUsers();
  }, [user, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all registered users</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            All Users ({users.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userData) => (
                <tr key={userData._id || userData.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {userData.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {userData.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userData.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {userData.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userData.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewUserPosts(userData)}
                      >
                        View Posts
                      </Button>
                      {(userData._id || userData.id) !== (user._id || user.id) && (
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => handleDeleteUser(userData)}
                          disabled={loading || confirmLoading}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={confirmOptions.title}
        message={confirmOptions.message}
        confirmText={confirmOptions.confirmText}
        cancelText={confirmOptions.cancelText}
        type={confirmOptions.type}
        loading={confirmLoading}
      />
    </div>
  );
}
