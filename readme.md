# TrackMate — Field Worker Tracking App

## Overview

TrackMate is a full-stack field worker tracking and task management application built as a capstone project. It helps managers assign work, organize employees into departments, verify attendance with location-aware check-ins, and review activity logs, while employees can see assigned tasks, submit completion updates, and track their schedules from a single dashboard.

This README is written for interview use: it gives a quick picture of the problem, the implemented features, and the parts of the codebase to reference when explaining the project.

## Core Features

- Role-based access: Separate manager and employee flows with different permissions.
- Authentication: Email/password login with JWTs and OTP utilities for sensitive flows.
- Task and schedule management: Managers can create, assign, update, and review tasks; employees can view and complete their assigned work.
- Attendance verification: Check-in and check-out flows with location capture and timestamped records for accountability.
- Department management: Create and manage departments and assign users appropriately.
- File uploads: Support for profile images and task attachments through the backend uploads folder.
- Activity logs and reporting: Track attendance, task updates, and completion history for transparency.
- Offline support: Basic low-network handling with sync-once-online behavior.

Code is organized into `backend/` for Express APIs, models, and utilities, and `frontend/` for the React UI, pages, and assets.

## Pages in the App

- Login and signup flows
- Employee dashboard
- Manager dashboard
- Attendance check-in and verification page
- Schedule and task views
- Settings and profile management
- Help and support / FAQ



## Project Timeline

| Day  | Tasks |
|------|----------------------------------------------|
| 1    | Submitting Project Idea + Plan |
| 2    | Lo-Fi Design |
| 3    | Hi-Fi Design |
| 4    | GitHub Project Setup |
| 5    | Task & Milestone Tracking |
| 6    | Backend Initialization - setting up Node and Express backend |
| 7    | User Authentication (Username/Password) Using JWTs |
| 8    | Begin initial design concepts |
| 9    | Database Schema Creation |
| 10   | Database Operations (CRUD) |
| 11   | Implementing Entity Relationships |
| 12   | GET API Development |
| 13   | POST API Development |
| 14   | PUT API Development |
| 15   | DELETE API Development |
| 16   | Deploying Backend Server |
| 17   | Initializing React Frontend |
| 18   | Creating React Components |
| 19   | Deploying Frontend |
| 20   | Implementing File Upload |
| 21   | Third-Party Authentication |
| 22   | Implementing Rate Limiting |
| 23   | Testing with Jest |
| 24   | Dockerizing Application |
| 25   | Open Source Contribution |
| 26   | Increasing Project Usage |
| 27   | Collecting Feedback & Fixing Bugs |
| 28   | Final Submission & Documentation |

This structured timeline helps in completing the project efficiently within the planned 4-week schedule.

## Deployment

- Frontend: https://trackmateapp.netlify.app/
- Backend: https://six9-sanya-capstone-trackmate-2.onrender.com

## Conclusion

TrackMate demonstrates end-to-end full-stack development: API design, secure authentication, role-based UI flows, and deployment of both frontend and backend. In an interview, a strong walkthrough is: manager creates a task, employee checks in with verification, completes the work, and the system records the result for logs and reporting.

If needed, I can also add a short appendix with key API endpoints or example request/response payloads.

Kalvium Capstone Project

TrackMate — Streamlining Workforce Management Through Smart Task Tracking, Verification, and Productivity Monitoring.
