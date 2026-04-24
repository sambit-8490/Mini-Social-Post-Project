# 📸 Mini Social Post Application

A full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to create accounts, share posts with images, and interact with content through likes.

---

## 🚀 Features

- **User Authentication** — Secure signup and login with JWT-based auth
- **Create Posts** — Share text and image posts via Cloudinary image hosting
- **Like System** — Like/unlike posts with a modal showing who liked them
- **Protected Routes** — Auth middleware guards private API endpoints
- **Responsive UI** — Clean React frontend with skeleton loading states
- **Dockerized** — Full Docker Compose setup for easy deployment

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose) |
| Image Hosting | Cloudinary |
| Auth | JWT (JSON Web Tokens) |
| Containerization | Docker, Docker Compose |

---

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary SDK configuration
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register & login logic
│   │   └── postController.js   # CRUD & like logic for posts
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── uploadMiddleware.js     # Multer file upload handler
│   │   └── validationMiddleware.js # Request validation
│   ├── models/
│   │   ├── postModel.js        # Post schema
│   │   └── userModel.js        # User schema
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   └── postRoutes.js       # /api/posts routes
│   ├── server.js               # Express app entry point
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── CreatePost.js   # Post creation form
│       │   ├── LikeModal.js    # Modal showing users who liked a post
│       │   ├── Navbar.js       # Top navigation bar
│       │   ├── Post.js         # Individual post card
│       │   └── PostSkeleton.js # Loading skeleton UI
│       ├── context/
│       │   └── AuthContext.js  # Global auth state
│       ├── pages/
│       │   ├── HomePage.js     # Feed of all posts
│       │   ├── LoginPage.js    # Login form
│       │   └── SignupPage.js   # Signup form
│       ├── App.js
│       └── Dockerfile
│
└── docker-compose.yml
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Docker & Docker Compose](https://docs.docker.com/compose/) (optional)
- A [Cloudinary](https://cloudinary.com/) account

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🐳 Running with Docker

```bash
# From the project root
docker-compose up --build
```

The app will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 💻 Running Locally (without Docker)

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

### Posts

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/posts` | Get all posts | No |
| `POST` | `/api/posts` | Create a new post | ✅ Yes |
| `DELETE` | `/api/posts/:id` | Delete a post | ✅ Yes |
| `PUT` | `/api/posts/:id/like` | Like / unlike a post | ✅ Yes |

---

## 🔐 Authentication Flow

1. User registers or logs in via `/api/auth`
2. Server returns a signed JWT
3. JWT is stored in React context (`AuthContext`)
4. Protected requests include the token in the `Authorization: Bearer <token>` header
5. `authMiddleware.js` verifies the token on each protected route

---

## 🖼️ Image Uploads

Images are handled by **Multer** (`uploadMiddleware.js`) and uploaded directly to **Cloudinary**. The returned URL is stored in the post document in MongoDB.

---

## 🧩 Key Components

| Component | Purpose |
|---|---|
| `AuthContext` | Stores logged-in user state globally across the app |
| `Post` | Renders a single post with like button and author info |
| `PostSkeleton` | Placeholder UI shown while posts are loading |
| `LikeModal` | Displays the list of users who liked a post |
| `CreatePost` | Form for composing and submitting a new post |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
