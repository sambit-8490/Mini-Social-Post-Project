Mini Social Post Application (3W Internship Task)

This is a full-stack MERN application built as a submission for the 3W Full Stack Internship. It's a "mini-social" platform allowing users to sign up, create posts with text and images, and interact with a live feed by liking and commenting.

The project meets all core requirements and implements all bonus points, plus additional advanced features like real image uploads, post deletion, and an advanced, modern UI.

Live Demo

Frontend (Vercel): [Add your Vercel deployment link here]

Backend (Render): [Add your Render deployment link here]

Features

Core Requirements

User Authentication: Secure signup and login with email/password using JWT.

Create Posts: Users can create posts with text or by uploading an image.

Public Feed: A central feed shows all posts from all users.

Likes: Users can like and unlike posts.

Comments: Users can add comments to any post.

MERN Stack: React frontend, Node/Express backend, and MongoDB database.

Bonus & Advanced Features

[BONUS] Efficient Pagination: The feed uses efficient "Load More" pagination, loading 5 posts at a time to handle large-scale data.

[BONUS] Clean & Modern UI:

Skeleton Loaders: The feed shows a modern, shimmering skeleton UI (like Facebook/LinkedIn) while posts are loading.

Collapsible Comments: The comment section is collapsible to maintain a clean feed.

Loading States: All buttons (Login, Post, Comment) show spinners when active to prevent double-clicks.

Modals: Uses modals for a better user experience, including a list of "Who Liked This?"

[BONUS] Responsive & Optimized Layout: The app is fully responsive and looks great on mobile, tablet, and desktop, using MUI's grid system.

[BONUS] Well-structured Code & Best Practices:

Server-Side Validation: Uses express-validator to secure backend endpoints.

File Structure: Separate, well-organized frontend and backend folders.

Environment Variables: Uses .env files on both frontend and backend to protect sensitive keys.

[ADVANCED] Real Image Uploads: Instead of just image URLs, users can upload .jpg/.png files directly. Handled by multer and Cloudinary for cloud storage.

[ADVANCED] Full CRUD Lifecycle: Users can delete their own posts, which also removes the associated image from the cloud.

[ADVANCED] Data Population: The "Likes" count is clickable, opening a modal to show the list of all users who liked the post.

(Add a screenshot of your deployed application here. This is very important!)

Tech Stack

Category

Technology

Frontend

React, React Router, Material-UI (MUI), Axios, date-fns

Backend

Node.js, Express.js

Database

MongoDB (Atlas)

Authentication

JWT (JSON Web Tokens), bcrypt.js

File Handling

Cloudinary, Multer, Datauri

Validation

express-validator

Deployment

Vercel (Frontend), Render (Backend)

How to Run Locally

To get a local copy up and running, follow these steps.

Prerequisites

Node.js

npm (or yarn)

MongoDB Atlas account

Cloudinary account

1. Clone the repository

git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd mini-social-app


2. Backend Setup

# Navigate to the backend
cd backend

# Install dependencies
npm install

# Create a .env file and add your keys
touch .env


Your backend/.env file should look like this:

MONGO_URI=YOUR_MONGO_DB_CONNECTION_STRING
JWT_SECRET=YOUR_SUPER_SECRET_KEY
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET


# Run the backend server
npm run dev


The backend will be running on http://localhost:5000.

3. Frontend Setup

# Open a new terminal and go to the root
cd ..
cd frontend

# Install dependencies
npm install

# Create a .env file
touch .env


Your frontend/.env file should look like this:

REACT_APP_API_URL=http://localhost:5000/api


# Run the frontend app
npm start


The frontend will open on http://localhost:3000 and will be connected to your local backend.