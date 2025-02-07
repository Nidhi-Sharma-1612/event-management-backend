# Event Management Backend

## 🚀 Overview

The Event Management Backend is a RESTful API built with Node.js and Express.js. It provides authentication, event management, and real-time attendee updates using WebSockets.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Token)
- **File Storage:** Cloudinary (for event images)
- **WebSockets:** Socket.io
- **Environment Management:** dotenv

## 📌 Features

- **User Authentication:** Sign up, login, and secure routes using JWT.
- **Event Management:** CRUD operations for authenticated users.
- **Real-Time Attendee Updates:** WebSocket integration for instant updates.
- **Guest Mode:** Allows guests to view and join events.
- **Secure API Routes:** Role-based access control for event management.

## 📂 API Endpoints

### 🔐 Authentication Routes

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/auth/signup` | Register a new user     |
| POST   | `/api/auth/login`  | Login and get JWT token |

### 🎟 Event Management Routes

| Method | Endpoint          | Description                                          |
| ------ | ----------------- | ---------------------------------------------------- |
| GET    | `/api/events`     | Get all events (guest sees all, users see their own) |
| POST   | `/api/events`     | Create a new event (Authenticated users only)        |
| PUT    | `/api/events/:id` | Update an event (Only creator can update)            |
| DELETE | `/api/events/:id` | Delete an event (Only creator can delete)            |

### 👥 Attendee Management

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| POST   | `/api/events/join/:id`  | Join an event (Guests only)  |
| POST   | `/api/events/leave/:id` | Leave an event (Guests only) |

## 🏗 Project Workflow

### 1️⃣ Backend Workflow

1. **User Authentication**

   - Uses JWT-based authentication for login and protected routes.
   - Guests do not require authentication but are managed separately.

2. **Event CRUD Operations**

   - Users can create, update, and delete their own events.
   - Guests can only view events and join them.

3. **Real-Time Updates**

   - When a guest joins or leaves an event, WebSockets update all connected clients.

4. **Security Measures**
   - Passwords are hashed using bcrypt.
   - Role-based access control ensures guests cannot modify events.

## 🏃‍♂️ Getting Started

### Prerequisites

- **Node.js** and **MongoDB** installed

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/event-management-backend.git
   cd event-management-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create an `.env` file and add the following variables:**

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://your-mongodb-uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Start the backend server:**

   ```bash
   npm run dev
   ```

5. **API Testing:**
   - Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test the API endpoints.
