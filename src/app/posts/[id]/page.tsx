'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { Post } from '@/types';
import { postsApi } from '@/lib/api';

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    isOpen: isConfirmModalOpen,
    options: confirmOptions,
    loading: confirmLoading,
    showConfirmation,
    handleConfirm,
    handleClose,
  } = useConfirmationModal();

  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await postsApi.getPost(id as string);
        setPost(fetchedPost);
      } catch (err: any) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAuthorName = () => {
    if (!post || typeof post.author === 'string') {
      return 'Unknown Author';
    }
    return post.author.name;
  };

  const canEditPost = () => {
    if (!user || !post) return false;
    if (user.role === 'admin') return true;
    if (typeof post.author === 'string') return false;
    return user.id === post.author._id;
  };

  const handleDeletePost = () => {
    if (!post) return;
    
    showConfirmation(
      {
        title: 'Delete Post',
        message: `Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`,
        confirmText: 'Delete Post',
        cancelText: 'Cancel',
        type: 'danger',
      },
      async () => {
        try {
          await postsApi.deletePost(post._id);
          router.push('/');
        } catch (err: any) {
          setError('Failed to delete post');
          console.error('Error deleting post:', err);
          throw err; // Re-throw to keep modal open on error
        }
      }
    );
  };

  const handleEditPost = () => {
    router.push(`/edit-post/${post?._id}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Post not found'}
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            ← Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-white rounded-lg shadow-md p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-4">
              <span>By <strong>{getAuthorName()}</strong></span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.updatedAt !== post.createdAt && (
                <>
                  <span>•</span>
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </>
              )}
            </div>
            
            {canEditPost() && (
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleEditPost}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeletePost}
                  loading={confirmLoading}
                >
                  Delete Post
                </Button>
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>

      <div className="mt-8">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back to Posts
        </Button>
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
