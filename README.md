# AssignmentHub - Assignment Management System

A complete, production-ready, full-stack Assignment Management System built with React, Node.js, Express, MongoDB, and Socket.IO. Designed as an interactive, real-time platform for instructors (Admins) to publish learning materials and students to view, preview, and download assignments instantly.

---

## 🌟 Key Features

### Authentication & Authorization
- **Role-Based Access**: Separation of concern between `Admin` and `Student` dashboards.
- **Secure Sessions**: Token-based authentication using **JSON Web Tokens (JWT)** and secure password hashing via `bcryptjs`.
- **Persisted Authentication**: Automatic login restoration using local storage state syncing.

### Admin Dashboard (Control Panel)
- **Document Publisher**: Forms for Title, Description, Category, and file attachment.
- **Upload Progress Tracker**: Visual progress bar using Axios `onUploadProgress`.
- **Database Statistics**: Live counters summarizing:
  - Total Assignments Published
  - PDF Document Count
  - Microsoft Word (`.docx`) File Count
  - Image (`.png`, `.jpg`, `.jpeg`) Count
- **Activity Feed**: Instant logging of newly uploaded assignments.
<img width="1917" height="475" alt="image" src="https://github.com/user-attachments/assets/c937024b-ec0f-438b-920b-f13c9ddef7d5" />

<img width="1918" height="962" alt="image" src="https://github.com/user-attachments/assets/7faeead3-d318-47ad-a814-38a18fd9ecd9" />

### Student Dashboard
- **Instant Synchronization**: Real-time push updates via **Socket.IO**. When an admin publishes an assignment, students receive:
  - Toast Notification (React Hot Toast) with assignment name.
  - Automatic injection into their list (no page refresh).
  - Immediate update to the Statistics panels.
  - Live activity feed entries.
- **Search & Filter Control**: Instant fuzzy search across title, description, and tags, coupled with category filtering buttons.
- **Inline Previewer**: Native preview modals for PDF and Image types, and beautiful download fallbacks for Word (`.docx`) documents.
- **"NEW" Badges**: Glowing indicator badges highlighting files uploaded within the last 24 hours.
<img width="1918" height="967" alt="image" src="https://github.com/user-attachments/assets/ed82b326-502b-423c-a252-18b75a47fece" />


### Visual Design
- **Responsive Layout**: Designed for mobile, tablet, and desktop interfaces.
- **Glassmorphic Theme**: Sophisticated glass cards over a moving animated blue/purple gradient background.
- **Dark/Light Modes**: Complete system theme toggle with immediate storage persistence.
<img width="1918" height="965" alt="image" src="https://github.com/user-attachments/assets/abe99428-4f21-4f91-9ebd-c3bc8382bc7a" />
![Uploading image.png…]()


---

## 📁 Database Schema (MongoDB / Mongoose)

### User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Encrypted with bcryptjs
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
}
```

### Assignment Model
```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Programming', 'Web Development', 'Database', 'Aptitude', 'Other'], required: true },
  fileUrl: { type: String, required: true }, // Local server file path
  fileType: { type: String, enum: ['PDF', 'DOCX', 'PNG', 'JPG', 'JPEG'], required: true },
  uploadDate: { type: Date, default: Date.now },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}
```

---

## ⚙️ Environment Variables

### Backend Configuration (`server/.env`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/assignment_db
JWT_SECRET=supersecretkey_assignment_system_2026_safe
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port 27017.

### Step 1: Clone and Enter the Project
```bash
git clone <repository-url>
cd Assignment-Management-System
```

### Step 2: Set up Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` configuration file as detailed in the Environment Variables section.
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The server will start on port `5000`.*

### Step 3: Set up Frontend Client
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the client dev server:
   ```bash
   npm run dev
   ```
   *The client application will run on [http://localhost:5173](http://localhost:5173).*

---

## 🛠️ How to Demo

To test the real-time functionality of the system:

1. Open two separate web browsers (e.g. Chrome and Edge, or one standard tab and one Incognito tab).
2. **Browser 1 (Admin Session)**:
   - Click **Sign up** and create an account with role **Admin**.
   - You will be redirected to the **Admin Dashboard** showing statistics and the publish form.
3. **Browser 2 (Student Session)**:
   - Click **Sign up** and create an account with role **Student**.
   - You will be redirected to the **Student Dashboard** with the list of assignments and activity logs.
4. **Action**:
   - In **Browser 1**, fill in the assignment title (e.g. `React Redux Workflow`), choose category `Web Development`, select a PDF/Image file, and click **Publish Assignment**.
   - Watch the upload progress bar animate.
   - **Result**: **Browser 2** immediately pops up a toast notification, inserts the new card at the top with a **NEW** badge, updates the category charts/counts, and displays the log on the activity timeline—**without refreshing the page**.

---

## ☁️ Deployment Guide

### Deploying Backend (Express + Node)
1. **Hosting Providers**: Can be hosted easily on Render, Heroku, or AWS Elastic Beanstalk.
2. **Database**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-hosted MongoDB cluster.
3. **Environment Setup**: Update `MONGODB_URI` and `JWT_SECRET` in the host's config settings. Update `CLIENT_URL` to point to your live frontend address.

### Deploying Frontend (Vite + React)
1. **Build the assets**: Run `npm run build` inside the client folder. This compiles the static build to `client/dist/`.
2. **Hosting Providers**: The compiled static assets inside the `dist` folder can be hosted for free on platforms like Vercel, Netlify, or GitHub Pages.
3. **Configuration**: Ensure the base API URL inside `client/src/utils/api.js` points to your deployed backend domain.
