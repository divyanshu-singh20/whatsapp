# Simple 1-to-1 Real-Time Chat

A complete real-time private chat system built with MERN stack and Socket.io.

## Features

- Real-time messaging between two users
- Message history stored in MongoDB
- Socket.io for instant message delivery
- Clean, responsive UI with Tailwind CSS
- Message alignment (left/right)
- Auto-scroll to latest messages
- Prevent empty message sending

## Tech Stack

- **Frontend**: React, Socket.io Client, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Socket.io, MongoDB, Mongoose

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB running locally

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd simple-chat/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (already created):
   ```
   MONGO_URI=mongodb://localhost:27017/simple-chat
   PORT=5001
   ```

4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd simple-chat/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx vite
   ```

4. Open http://localhost:3001 in your browser

## How It Works

### Backend (Socket.io Server)

```javascript
// Users map to track online users
let users = {}; // { userId: socketId }

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("send_message", async (data) => {
    // Save to database
    const message = new Message(data);
    await message.save();

    // Send to receiver if online
    const receiverSocket = users[data.receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", data);
    }
  });

  socket.on("disconnect", () => {
    // Remove from users map
  });
});
```

### Frontend (React + Socket.io)

```javascript
// Connect to server
const socket = io('http://localhost:5001');

// Join chat
socket.emit("join", currentUser);

// Send message
socket.emit("send_message", {
  senderId: currentUser,
  receiverId: selectedUser,
  text: message
});

// Receive messages
socket.on("receive_message", (data) => {
  setMessages(prev => [...prev, data]);
});
```

## API Endpoints

- `GET /api/messages/:userId1/:userId2` - Get chat history between two users

## Database Schema

### Message
```javascript
{
  senderId: String,
  receiverId: String,
  text: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

1. Open the app in two browser tabs/windows
2. In first tab, enter "user1" as user ID
3. In second tab, enter "user2" as user ID
4. Select each other from the user list
5. Start chatting - messages appear instantly!

## Features Implemented

✅ Real-time messaging with Socket.io
✅ Message persistence in MongoDB
✅ Load chat history on user selection
✅ Auto-scroll to latest messages
✅ Message alignment (sender left, receiver right)
✅ Prevent empty messages
✅ Clean, responsive UI
✅ User online/offline tracking
✅ Mock user list for testing

## Testing

- Open http://localhost:3001 in multiple tabs
- Use different user IDs (user1, user2, user3)
- Select users and send messages
- Messages should appear instantly in other tabs
- Refresh page - chat history loads from database

The system provides a complete foundation for building real-time chat applications!</content>
<parameter name="filePath">d:\what\simple-chat\README.md