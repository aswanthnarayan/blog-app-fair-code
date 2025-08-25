# 📝 Blog App - Full-Stack Next.js Blog Platform

A modern, feature-rich blog application built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS. This application provides a complete blogging platform with user authentication, role-based access control, and comprehensive admin features.

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login** with JWT tokens
- **Role-based Access Control** (User/Admin roles)
- **Protected Routes** with automatic redirects
- **Password Hashing** with bcryptjs
- **Token Management** with automatic expiration handling

### 📱 User Features
- **Create, Edit, Delete Posts** (own posts only)
- **View All Posts** in a clean, responsive layout
- **Profile Management** with ability to update name, email, and password
- **View Own Posts** in profile section
- **Responsive Design** that works on all devices

### 👑 Admin Features
- **User Management** - View all users, delete users, promote to admin
- **Post Management** - Edit/delete any user's posts
- **Admin Dashboard** with user statistics
- **View Posts by User** - See all posts by any specific user
- **Role Management** - Promote users to admin status

### 🎨 UI/UX Features
- **Modern Design** with Tailwind CSS
- **Active Route Highlighting** in navigation
- **Custom Confirmation Modals** for destructive actions
- **Loading States** and error handling throughout
- **Professional Typography** and spacing
- **Mobile-First Responsive Design**

### 🛡️ Security Features
- **JWT Token Authentication** with 1-hour expiration
- **Input Validation** with Zod schemas
- **SQL Injection Protection** with Mongoose ODM
- **Password Hashing** with bcryptjs
- **Admin-only Route Protection**
- **CSRF Protection** built into Next.js

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom UI Components** - Reusable component library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Zod** - Schema validation library
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Turbopack** - Fast bundler for development
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-app-fair-code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blog-app
   # or use MongoDB Atlas connection string
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-app

   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── posts/         # Post CRUD endpoints
│   │   ├── profile/       # User profile endpoints
│   │   └── users/         # User management endpoints
│   ├── admin/             # Admin-only pages
│   ├── posts/             # Post-related pages
│   └── ...                # Other pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── blog/             # Blog-specific components
│   └── layout/           # Layout components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── models/               # MongoDB/Mongoose models
├── types/                # TypeScript type definitions
└── middleware/           # Custom middleware
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (authenticated)
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post (author/admin only)
- `DELETE /api/posts/[id]` - Delete post (author/admin only)

### Profile
- `GET /api/profile` - Get user profile (authenticated)
- `PUT /api/profile` - Update user profile (authenticated)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/[id]` - Get single user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Admin
- `POST /api/admin/promote` - Promote user to admin (temporary endpoint)

## 👥 User Roles

### Regular User
- Create, edit, delete own posts
- View all posts
- Manage own profile
- View own posts in profile

### Admin User
- All user permissions
- Edit/delete any post
- View all users
- Delete users
- View posts by any user
- Promote users to admin

## 🎯 Usage Guide

### For Regular Users

1. **Register/Login**
   - Create an account or login with existing credentials
   - Navigate using the top navigation bar

2. **Create Posts**
   - Click "Create Post" in the navigation
   - Fill in title and content
   - Submit to publish

3. **Manage Posts**
   - View your posts in the Profile section
   - Edit or delete your own posts
   - View all posts on the home page

4. **Profile Management**
   - Update your name, email, or password
   - View all your published posts

### For Admin Users

1. **User Management**
   - Access "Admin" section in navigation
   - View all registered users
   - Delete users or view their posts

2. **Post Management**
   - Edit or delete any user's posts
   - View posts by specific users

3. **Promote Users**
   - Use the temporary promotion endpoint to make users admins

## 🔒 Security Considerations

- **JWT tokens expire after 1 hour** for security
- **Passwords are hashed** using bcryptjs
- **Input validation** on all forms and API endpoints
- **Role-based access control** prevents unauthorized actions
- **Admin-only routes** are protected server-side

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure these are set in your production environment:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT signing

### Recommended Platforms
- **Vercel** - Optimized for Next.js applications
- **Netlify** - Good alternative with easy deployment
- **Railway** - Includes database hosting
- **DigitalOcean App Platform** - Full-stack hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


