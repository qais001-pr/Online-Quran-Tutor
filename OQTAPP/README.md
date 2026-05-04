# Online Quran Tutor App

A modern **React Native mobile application** designed to connect students with qualified Quran tutors through a seamless and interactive learning experience.

Online Quran Tutor enables **real-time communication, structured learning, and personalized progress tracking**, all optimized for Android devices.

---

## Overview

Whether you're a beginner starting your Quranic journey or an advanced learner seeking specialized guidance, **Online Quran Tutor** provides a complete digital environment for effective Islamic education.

---

## Features

### Core Features

* **Live Video/Audio Sessions**
  Real-time communication with tutors using WebRTC

* **Lesson Scheduling**
  Book, reschedule, and manage sessions

* **User Authentication**
  Secure login and registration system

* **Progress Tracking**
  Monitor learning progress and performance

* **Quran Text Viewing**
  Smooth and accessible Quran reading experience

* **Notes & Bookmarks**
  Save important verses and organize study materials

---

### Technical Features

* **Real-Time Communication** via Socket.io
* **Offline Support** using Async Storage
* **Bottom Tab Navigation** (React Navigation)
* **Material Design UI** (React Native Paper)

---

## Prerequisites

Make sure your environment is properly set up before running the project:

**Node.js** (v20 or higher)

**npm** (comes with Node.js)

**React Native CLI**
 
``` bash
    npm install -g react-native-cli
```

**Android Studio**
  Android SDK
  API Level 26+

**Java Development Kit (JDK)** (v11 or higher)

**Git**
    For version control
---

## 🏗️ Architecture

### ⚙️ Technology Stack

| Technology          | Purpose                               |
| ------------------- | ------------------------------------- |
| React Native        | Cross-platform mobile development     |
| React Navigation    | App routing and navigation            |
| React Native Paper  | Material Design UI components         |
| React Native WebRTC | Real-time video/audio communication   |
| Socket.io Client    | Real-time messaging and notifications |
| Async Storage       | Local data persistence                |

---

### 📚 Key Libraries

| Library                                   | Purpose                                   |
| ----------------------------------------- | ----------------------------------------- |
| @react-navigation/native                  | Core navigation container                 |
| @react-navigation/bottom-tabs             | Bottom tab navigation                     |
| @react-navigation/native-stack            | Stack-based navigation                    |
| @react-navigation/stack                   | Additional stack navigation support       |
| react-native-gesture-handler              | Gesture handling                          |
| react-native-screens                      | Native screen optimization                |
| react-native-safe-area-context            | Safe area handling for devices            |
| react-native-paper                        | Material Design UI components             |
| react-native-vector-icons                 | Icon support                              |
| react-native-webrtc                       | Real-time video/audio communication       |
| socket.io-client                          | Real-time messaging and notifications     |
| @react-native-async-storage/async-storage | Local data persistence                    |
| react-native-image-picker                 | Image selection from gallery/camera       |
| react-native-date-picker                  | Date selection                            |
| react-native-element-dropdown             | Dropdown components                       |
| country-state-city                        | Location data handling                    |

---

## 📂 Project Structure 

```
src/
├── assets/
├── components/
├── context/
├── screens/
├── styles/
├── theme/
```
---


## 📥 Installation

### Clone the Repository

```bash
    git clone https://github.com/qais001-pr/Online-Quran-Tutor.git
    cd Online-Quran-Tutor
```

---

### Install Dependencies

```bash
    npm install
```
---

### Run the Application

```bash
    npx react-native run-android
```