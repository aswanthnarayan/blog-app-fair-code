import { AuthResponse, LoginData, RegisterData, User, Post, CreatePostData, UpdateProfileData } from '@/types';

const API_BASE = '/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  // Only access localStorage on client side
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Auth API calls
export const authApi = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
};

// Posts API calls
export const postsApi = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${API_BASE}/posts`);
    return handleResponse(response);
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await fetch(`${API_BASE}/posts/${id}`);
    return handleResponse(response);
  },

  createPost: async (postData: CreatePostData): Promise<{ message: string; post: Post }> => {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    return handleResponse(response);
  },

  updatePost: async (id: string, postData: Partial<CreatePostData>): Promise<{ message: string; post: Post }> => {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    return handleResponse(response);
  },

  deletePost: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Profile API calls
export const profileApi = {
  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData: UpdateProfileData): Promise<{ message: string; user: User }> => {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },
};

// Users API calls (Admin only)
export const usersApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Token management
export const tokenUtils = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  getToken: () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};
