# Real-Time Chat Application (MERN Stack)

This is a real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js). It supports both private messaging and group chat functionality. The app also includes features like user authentication, real-time notifications, and a basic friendship system.

## Features

- **Real-Time Chat**: Users can send and receive messages instantly using WebSockets (Socket.io).
- **Private Messaging**: Users can chat one-on-one.
- **Group Chat**: Users can create and participate in group chats.
- **Searching System**: You can search for users and send to them a request.
- **User Authentication**: Users can sign up, log in, and manage their profiles.
- **Profile Customization**: Users can update their profile pictures and display names.
- **Responsive UI**: Built with React and styled to be mobile-friendly.

## Tech Stack

- **Frontend**: React, Socket.io-client, Axios,zustand
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Real-Time Communication**: Socket.io
- **Image Storage**: cloudinary
- **Styling**: CSS, tailwindcss, daisyui

## Prerequisites

- Node.js (version 14 or above)
- MongoDB (you can use MongoDB Atlas for a cloud database or install MongoDB locally)
- A code editor (e.g., VSCode)
- Postman or any other API testing tool (optional, for testing backend routes)

## Installation

### 1. Clone the repository

````bash
git clone https://github.com/Abd-El-Rahmen/Real-Time-Chat-App.git
cd Real-Time-Chat-App

### 2. Install Backend Dependencies

```bash
cd backend
npm install express mongoose socket.io jwt-simple dotenv bcryptjs cloudinary cors

### 3. Configure Environment Variables

```env

PORT
MONGODB_URL
JWT_SECRET
NODE_DEV
FRONTEND
COUNDINARY_API_KE
COUNDINARY_NAME
COUNDINARY_API_SECRET

### 4. Run the Backend Server

```bash
npm run dev

### 5. Install Frontend Dependencies

```bash
cd ../frontend
npm install

### 6. Configure Frontend Environment Variables

```env
VITE_API_URL 

### 7. Run the Frontend Server

```bash
npm run dev
