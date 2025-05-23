﻿# todo-app-fullstack-server
# 🛠️ To-Do App Backend

This is the **backend API** for the Fullstack To-Do application, built with **Node.js, Express.js, and MongoDB**. It provides user authentication using **JWT** and supports full CRUD operations for managing tasks.

## 🔐 Features

- User registration and login with hashed passwords (`bcrypt`)
- JWT-based authentication and route protection
- Create, Read, Update, Delete (CRUD) operations for To-Do tasks
- Search tasks by:
  - Name (case-insensitive partial match)
  - Status (completed or pending)
  - Creation Date
- Pagination support for task list

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **dotenv** for environment config
- **CORS** for security

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/shubhamkhatik/todo-app-fullstack-server.git
cd todo-app-fullstack-server
npm install

npm run dev
```
.env 
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

