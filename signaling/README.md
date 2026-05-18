## Signaling Server (WebRTC)

This project contains the **Signaling Server** used for enabling real-time communication between Students and Tutors in the Online Quran Tutor platform. It handles WebRTC signaling using WebSockets/Socket.IO to establish peer-to-peer video/audio connections.

---

# Project Structure

```
signaling/
│
├── node_modules/
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
```

---

# Features

* Real-time WebRTC signaling
* Peer-to-peer connection setup
* Room-based communication (Student ↔ Tutor)
* Join / Leave session handling
* Offer / Answer exchange
* ICE candidate sharing
* Lightweight Node.js server

---

# Technologies Used

* Node.js
* Express.js (if used in server.js)
* Socket.IO / WebSocket
* WebRTC Signaling Logic

---

# Prerequisites

Before running the signaling server, ensure you have:

* Node.js (v16+ recommended)
* npm (Node Package Manager)

---

# Setup Instructions

## Step 1: Navigate to Signaling Folder

```bash
cd signaling
```

---

## Step 2: Install Dependencies

Install required packages:

```bash
npm install
```

---

## Step 3: Start the Server

Run the signaling server:

```bash
node server.js
```

OR (if configured in package.json):

```bash
npm start
```

---

# Server Configuration

By default, the server runs on:

```
http://localhost:PORT
```

Check your `server.js` file for the exact port number:

```js
const PORT = 4000;
```

---

# How It Works (WebRTC Flow)

1. Student joins a class room
2. Tutor joins the same room
3. Server creates a communication channel
4. Exchange happens:

   * Offer
   * Answer
   * ICE Candidates
5. Direct peer-to-peer video/audio connection is established

---

# Core Responsibilities

* Manage user connections
* Handle room joining logic
* Relay WebRTC signaling data
* Maintain session state
* Support real-time class communication

---

# Testing

To test locally:

1. Start server:

   ```bash
   node server.js
   ```

2. Connect from two devices/emulators:

   * Student app
   * Tutor app

3. Ensure both join same room ID
