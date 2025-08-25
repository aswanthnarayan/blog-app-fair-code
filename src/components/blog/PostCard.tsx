import React from 'react';
import Link from 'next/link';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAuthorName = () => {
    if (typeof post.author === 'string') {
      return 'Unknown Author';
    }
    return post.author.name;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <Link href={`/posts/${post._id}`}>
          <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
            {post.title}
          </h2>
        </Link>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 line-clamp-3">
          {post.content.length > 150 
            ? `${post.content.substring(0, 150)}...` 
            : post.content
          }
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <span>By {getAuthorName()}</span>
        </div>
        <div>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <Link href={`/posts/${post._id}`}>
          <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
            Read more →
          </span>
        </Link>
      </div>
    </div>
  );
};
