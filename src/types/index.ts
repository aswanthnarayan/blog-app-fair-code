export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  errors?: any;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
}
