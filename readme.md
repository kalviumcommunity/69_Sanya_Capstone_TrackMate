# 🚀 TrackMate

**TrackMate** is a workforce management and employee tracking platform designed to streamline task assignment, employee monitoring, attendance verification, and productivity tracking for organizations managing field employees.

The platform enables managers to assign tasks, organize employees into departments, monitor task completion, and review employee activity logs, while employees can access assigned tasks, complete field assignments, and verify their work using location and image-based check-ins.

---

# 📌 Problem Statement

Organizations with field employees often struggle with:

* Tracking employee task completion
* Verifying on-site attendance
* Managing schedules efficiently
* Monitoring employee productivity
* Maintaining accurate task records

Traditional manual systems can lead to inaccurate reporting, lack of transparency, and inefficient workforce management.

TrackMate solves these challenges through a centralized digital platform that combines task management, verification logs, and productivity monitoring.

---

# 🎯 Key Features

## 🔐 Authentication & Authorization

* Secure JWT-based authentication
* Role-based access control
* Separate Manager and Employee portals
* Protected backend APIs

---

## 👨‍💼 Manager Dashboard

Managers can:

* View all employees
* Assign employees to departments
* Create and assign tasks
* View employee schedules
* Track task completion
* Monitor employee logs
* Search employees by name
* Filter employees by department
* Remove employees when required

---

## 👷 Employee Dashboard

Employees can:

* View assigned tasks
* Access task details
* Track upcoming assignments
* View completed tasks
* Access activity logs
* View department information

---

## 📋 Task Management System

Managers can create tasks with:

* Date
* Time
* Address
* City
* Pincode
* Task Description

Employees can:

* View assigned tasks
* Complete assigned tasks
* Submit verification details

---

## 📍 Location Verification

TrackMate records employee location during task completion.

Features include:

* GPS-based location capture
* Google Maps location links
* Check-in location verification
* Check-out location verification

This helps managers confirm that employees visited the assigned work site.

---

## 📸 Image-Based Task Verification

To improve accountability, employees must capture images during task completion.

### Check-In

* Open camera
* Capture live image
* Record timestamp
* Record location

### Check-Out

* Open camera
* Capture live image
* Record timestamp
* Record location

---

## 📝 Task Activity Logs

Every completed task stores:

### Check-In Details

* Check-In Time
* Check-In Image
* Check-In Location

### Check-Out Details

* Check-Out Time
* Check-Out Image
* Check-Out Location

These logs provide proof of task completion and improve transparency.

---

## 📊 Productivity Motivation System

TrackMate includes a built-in employee motivation feature.

The system:

* Tracks completed tasks
* Calculates daily completion percentage
* Generates motivational notifications
* Encourages consistent task completion

Examples:

* Progress-based encouragement messages
* Completion milestone notifications
* Productivity-focused feedback

This improves employee engagement and creates a more positive work experience.

---

# 🏗️ System Architecture

## Frontend

* React.js
* React Router DOM
* Tailwind CSS
* React Toastify
* Lucide React
* React Icons

## Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

## Database

* MongoDB
* Mongoose ODM

## Deployment

* Netlify (Frontend)
* Render (Backend)

---

# 👥 User Roles

## Manager

### Permissions

* View all employees
* Assign departments
* Create tasks
* Manage workforce
* View employee schedules
* Monitor completed work
* Access employee logs

---

## Employee

### Permissions

* View assigned tasks
* Access task details
* Complete tasks
* Submit check-in/check-out verification
* View completed task history

---

# 🗂️ Database Models

## User Model

Stores:

* Name
* Email
* Password
* Role
* Department

---

## Task Model

Stores:

* Employee ID
* Date
* Time
* Address
* City
* Pincode
* Description
* Status
* Check-In Logs
* Check-Out Logs
* Creation Timestamp

---

# 🔄 Workflow

### Manager Workflow

1. Create employee accounts
2. Assign employees to departments
3. Create tasks
4. Assign tasks to employees
5. Monitor employee progress
6. Review logs and task completion

---

### Employee Workflow

1. Login to dashboard
2. View assigned tasks
3. Open task details
4. Capture check-in image and location
5. Perform assigned work
6. Capture check-out image and location
7. Mark task as completed
8. View completed task history

---

# 📁 Project Structure

```bash
TrackMate/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── config/
│
└── README.md
```

# ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/TrackMate.git
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run Backend

```bash
npm start
```

### Run Frontend

```bash
npm run dev
```

---

# 🚀 Live Deployment

### Frontend

https://trackmateapp.netlify.app/

### Backend

https://six9-sanya-capstone-trackmate-2.onrender.com

---

# 🔮 Future Enhancements

* Google Authentication
* Face Recognition Verification
* Real-Time Employee Tracking
* Push Notifications
* Attendance Analytics Dashboard
* AI-Powered Productivity Insights
* Mobile Application
* Offline Support
* Automated Report Generation

---

# 🛠️ Tech Stack

| Category       | Technology          |
| -------------- | ------------------- |
| Frontend       | React.js            |
| Styling        | Tailwind CSS        |
| Backend        | Node.js, Express.js |
| Database       | MongoDB             |
| Authentication | JWT                 |
| Deployment     | Netlify, Render     |

---

# 👩‍💻 Author

**Sanya Thakur**

Kalvium Capstone Project

TrackMate — Streamlining Workforce Management Through Smart Task Tracking, Verification, and Productivity Monitoring.
