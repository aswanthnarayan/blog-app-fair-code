'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { PostCard } from '@/components/blog/PostCard';
import { postsApi, usersApi } from '@/lib/api';
import { Post, User } from '@/types';

export default function UserPostsPage() {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not admin
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchUserAndPosts = async () => {
      try {
        // Fetch all users to find the target user
        const allUsers = await usersApi.getAllUsers();
        const foundUser = allUsers.find((u: User) => (u._id || u.id) === id);
        
        if (!foundUser) {
          setError('User not found');
          setLoading(false);
          return;
        }
        
        setTargetUser(foundUser);

        // Fetch all posts and filter by this user
        const allPosts = await postsApi.getAllPosts();
        const filteredPosts = allPosts.filter((post: Post) => {
          if (typeof post.author === 'string') return false;
          return (post.author._id || post.author.id) === (foundUser._id || foundUser.id);
        });
        
        setUserPosts(filteredPosts);
      } catch (err: unknown) {
        setError('Failed to load user posts');
        console.error('Error fetching user posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserAndPosts();
    }
  }, [id, user, router]);

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

  if (error || !targetUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'User not found'}
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          ← Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Posts by {targetUser.name}
            </h1>
            <p className="text-gray-600">
              {targetUser.email} • {userPosts.length} posts
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin/users')}>
            ← Back to Users
          </Button>
        </div>
      </div>

      {userPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">This user hasn't created any blog posts.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
