# Quillify — AI Powered Blogging Platform

## 🚀 Overview

Quillify is a full-stack AI-powered blogging platform built using the MERN stack.
It allows users to create, edit, manage, and explore blogs with rich text editing, AI-assisted writing, image uploads, authentication, and role-based access control.

The platform includes separate functionalities for users and admins, modern UI/UX features, and scalable backend architecture.

---

# 🛠 Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Quill Editor
* React Toastify

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Passport.js (Google OAuth)

## Third Party Services

* ImageKit (Image Uploads)
* Groq AI API (AI Blog Generation)

---

# ✨ Features

## 🔐 Authentication & Authorization

* User Registration & Login
* JWT Authentication
* Google OAuth Login using Passport.js
* Protected Routes
* Role-Based Access Control (User / Admin)

---

## 🏠 Home Page

* Display real blogs from database
* Search blogs
* Category filtering
* Pagination support
* Responsive blog cards

---

## 📝 Blog Management

* Create Blog
* Edit Blog
* Delete Blog
* Draft & Resubmit system
* Rich Text Editor using Quill
* AI-assisted blog generation
* Image upload with ImageKit

---

## 📖 Blog Detail Page

* Full blog content rendering
* Comments system
* Blog views counter
* Like / Reactions feature
* Reading progress bar

---

## 👤 User Dashboard

* User statistics
* Blog filtering
* Submit / Resubmit blogs
* Manage personal blogs

---

## 🛡 Admin Panel

* Admin sidebar dashboard
* Manage all blogs
* Manage users
* Approve / reject blogs
* Monitor platform activity

---

## 💬 Comments System

* Add comments
* Delete comments
* Backend + frontend integration

---

## 👤 Profile Management

* Update profile details
* Change password
* Upload profile image using ImageKit

---

## 🎨 UI Features

* Responsive design
* Toast notifications
* Clean modern interface
* Loading states
* Error handling

---

# 📂 Project Structure

```bash
quillify/
│
├── client/          # Frontend
│
├── server/          # Backend
│
├── .gitignore
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/quillify.git
cd quillify
```

---

## 2️⃣ Install Dependencies

### Client

```bash
cd client
npm install
```

### Server

```bash
cd server
npm install
```

---

# 🔑 Environment Variables

## Server `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

GROQ_API_KEY=your_groq_api_key
```

---

# ▶️ Run Project

## Start Backend

```bash
cd server
npm run dev
```

## Start Frontend

```bash
cd client
npm run dev
```

---

# 🌐 Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB

---

# 📸 Core Modules

* Authentication System
* Google OAuth
* Blog Management
* Admin Panel
* AI Blog Generator
* Image Upload System
* Comments System
* Dashboard Analytics

---

# 📈 Future Improvements

* Bookmark blogs
* Follow authors
* Dark mode
* Notifications system
* Blog analytics charts
* SEO optimization

---

# 👨‍💻 Author

Developed by **Syed Amaan**

MERN Stack & Next.js Developer
