# Mini Social Media App 🚀  
**CodeAlpha Internship – Task No: 1**

A full-stack mini social media application built using **MERN stack** with authentication, user profiles, posts, likes, comments, follow system, and image uploads using Cloudinary.

---

## 📌 Features

### 👤 User
- User registration & login (JWT authentication)
- Update profile details
- Upload profile picture
- Search users by username
- View other user profiles
- Follow / Unfollow users

### 🖼️ Posts
- Create post with image & caption
- Delete post (only post owner)
- Like / Unlike post
- Comment on posts
- Delete comment (only comment owner)

### 🔐 Authorization Rules
- Only authenticated users can create posts
- Users can delete **only their own posts**
- Users can delete **only their own comments**
- JWT token is verified on protected routes

---

## 🛠️ Tech Stack

### Frontend
- React JS
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (file handling)
- Cloudinary (image storage)

### Database
- MongoDB
- Mongoose

---

## ☁️ Cloud & File Upload
- **Cloudinary** for storing post images & profile pictures
- **Multer** for handling multipart form data

---

## Configuration 

Create a `.env` file in **backend/** folder:

```env
PORT=8000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

---
