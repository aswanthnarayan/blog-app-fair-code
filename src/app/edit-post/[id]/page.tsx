'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { postsApi } from '@/lib/api';
import { Post } from '@/types';

export default function EditPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');

  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await postsApi.getPost(id as string);
        setPost(fetchedPost);
        setTitle(fetchedPost.title);
        setContent(fetchedPost.content);
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

  // Check permissions
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (post && user) {
      const canEdit = user.role === 'admin' || 
        (typeof post.author !== 'string' && user.id === post.author._id);
      
      if (!canEdit) {
        router.push('/');
        return;
      }
    }
  }, [user, post, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setSaveLoading(true);
    setError('');

    try {
      await postsApi.updatePost(post._id, { title, content });
      router.push(`/posts/${post._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            ← Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!user || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Access denied.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
        <p className="text-gray-600">Update your blog post</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Post Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter a compelling title for your post"
        />

        <Textarea
          label="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Write your post content here..."
          rows={12}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            loading={saveLoading}
            disabled={!title.trim() || !content.trim()}
          >
            Update Post
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
