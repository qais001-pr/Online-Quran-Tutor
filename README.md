# Online Quran Tutor

A modern Quran learning platform that connects Students, Tutors, and Guardians through real-time online classes, scheduling management, and progress tracking.

## Project Overview

Online Quran Tutor is a modern Quran learning platform designed to connect Students, Tutors, and Guardians in a secure and interactive online environment. The application provides real-time learning sessions, schedule management, class monitoring, and progress tracking features.

The system contains three main user roles:

* Student
* Tutor
* Guardian

Students and Tutors can create accounts and select their weekly free-time schedules based on availability. After selecting schedules, students can search for available tutors according to matching free time and send class requests.

Before requesting a class, the student selects a Surah for learning. Tutors receive class requests and can accept or reject them. If multiple requests are submitted for the same tutor and time slot, only one request can be accepted while the remaining requests are automatically rejected.

Once a request is accepted, classes are created between the Tutor and Student. The application supports real-time video calling functionality for conducting online Quran sessions.

After each class, Tutors can:

* Save student progress
* Add feedback and notes
* Assign badge scores
* Track learning improvements

Students can:

* Rate Tutors
* Submit comments and reviews
* Join scheduled classes
* View learning history and progress

Guardians have additional monitoring features. A Guardian can:

* Add child accounts
* Select schedules for children
* Monitor upcoming classes
* Track child progress and performance
* Observe class activities and reports

Students can also log in independently using their own accounts and join classes directly from the application.

The goal of this platform is to provide a complete digital Quran learning experience with real-time communication, progress monitoring, scheduling management, and interactive learning tools.

---

# Features

## Student Features

* Student Registration and Login
* Weekly Availability Schedule Selection
* Search Available Tutors
* Send Class Requests to Tutors
* Select Surah Before Class Request
* Join Live Quran Classes
* Real-Time Video Calling
* View Learning History
* View Progress Reports
* Rate Tutors and Add Comments

## Tutor Features

* Tutor Registration and Login
* Weekly Availability Schedule Management
* Accept or Reject Student Requests
* Automatic Handling of Time Slot Conflicts
* Conduct Live Quran Classes
* Add Student Feedback
* Save Notes and Learning Progress
* Assign Badge Scores
* Manage Student Sessions

## Guardian Features

* Guardian Registration and Login
* Add Child Accounts
* Manage Child Schedule
* Monitor Student Classes
* Track Student Performance
* View Progress Reports and Learning Activity

## Real-Time Features

* Real-Time Video Calling using WebRTC
* Live Communication
* Socket-Based Signaling
* Real-Time Schedule Handling
* Dynamic Class Creation

---

# Technologies Used

## Frontend

* React Native

## Backend

* Node.js
* Express.js
* Socket.IO
* ASP.Net WEBAPI

## Database

* SQL Server

## Real-Time Communication

* WebRTC
* Socket.IO

## Tools & Services

* Android Studio
* Microsoft Visual Studio
* Microsoft SQL Server Management Studio
* SQL Server
* Microsoft Visual Studio Code
* Git & GitHub

---

# Project Structure

```bash
Online-Quran-Tutor/
│
├── app/
├── db/
├── signaling/
├── slides/
├── webapi/
├── .gitignore
└── README.md
```

---

# Prerequisites

Before setting up the project, make sure the following tools are installed on your system.

## Required Software

* Node.js
* npm or yarn
* React Native CLI
* SQL Server
* Microsoft SQL Server Management Studio
* Microsoft Visual Studio Code
* Microsoft Visual Studio
   * Install the ASP.NET and Web Development workload for the Web API project
* Android Studio
* Java JDK
* Git

---
# Navigate to the Online-Quran-Tutor Directory
``` bash
cd Online-Quran-Tutor 
```
#  BackEnd Setup

##  Move to db Folder

```bash
cd db
```
---

#  Signaling Setup

##  Move to Signaling Folder

```bash
cd signaling
```
---

#  WebApi Setup

##  Move to webapi Folder

```bash
cd webapi
```
---

#  React Native Setup

##  Move to app Folder

```bash
cd app
```
---

# Application Workflow

## User Registration

* User creates an account.
* User logs into the application.

## Teacher Dashboard

* Teacher can manage classes.
* Teacher can start live sessions.
* Teacher can monitor student attendance.

## Student Dashboard

* Student can join classes.
* Student can attend Quran sessions.
* Student can communicate with teacher.

## Real-Time Calling

* Audio/video communication is handled using WebRTC.
* Socket.IO is used for signaling.

---

# Project Slides

[Download Presentation Slides](./slides//app.pptx)

# Contribution

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.
3. Commit changes.
4. Push code.
5. Create a Pull Request.

---

# License

This project is created for educational and learning purposes.

---

# Author

## Muhammad Qais

* Software Engineer
* GitHub: [https://github.com/qais001-pr](https://github.com/qais001-pr)