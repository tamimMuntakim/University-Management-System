# UniMS - University Management System

UniMS is a full-stack, role-based university management platform built with a **Spring Boot** backend and a **React** frontend. It provides separate portals for **Admins**, **Faculty**, and **Students**, along with a rich analytics dashboard built using custom **D3.js** visualizations.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Roles & Access](#roles--access)
- [Analytics Dashboard](#analytics-dashboard)
- [License](#license)

---

## Overview

UniMS manages the core academic workflow of a university: departments, courses, course offerings per term, faculty assignments, student enrollments, and grading - all behind a JWT-secured, role-based access system. An admin-facing analytics dashboard surfaces enrollment trends, login activity, department performance, and academic distribution through a set of custom-built charts.

---

## Tech Stack

### Backend

| Component | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 4.0.6 |
| Persistence | Spring Data JPA |
| Database | PostgreSQL |
| Security | Spring Security + JJWT (JWT-based stateless auth) |
| Validation | Spring Validation |
| Boilerplate Reduction | Lombok |
| Env Config | spring-dotenv |
| Build Tool | Maven |

### Frontend

| Component | Technology |
|---|---|
| Library | React 19 |
| Build Tool | Vite |
| Routing | React Router 7 |
| HTTP Client | Axios |
| Styling | Tailwind CSS + DaisyUI |
| Charts | D3.js 7 (custom components) |
| Alerts/Modals | SweetAlert2 |
| Icons | React Icons |
| Linting | ESLint |

---

## Features

- **JWT-based authentication** with role-aware redirects (Admin / Faculty / Student)
- **Admin Portal** - dashboard, user management, department management, course management, course offering management, enrollment management
- **Faculty Portal** - profile view, assigned courses, grade management
- **Student Portal** - dashboard, profile, enrollment view
- **Analytics Dashboard** - 18+ custom D3.js visualizations covering login activity, registration trends, department performance, enrollment/offering status, and academic distribution
- **Light/Dark theme switching** via a global theme provider
- **Custom UI notifications** (SweetAlert2) in place of native browser alerts
- **Protected routing** on the frontend backed by role checks on the backend

---

## Project Structure

```
UniMS/
├── backend/
│   ├── dummy.sql
│   ├── pom.xml
│   └── src/main/java/com/university/management/
│       ├── UniversityManagementApplication.java
│       ├── config/            # JpaConfig (auditing, etc.)
│       ├── controller/        # REST controllers (Auth, User, Department, Course,
│       │                      #   CourseOffering, Enrollment, FacultyPortal,
│       │                      #   StudentPortal, Analytics, AdminStats)
│       ├── dto/                # LoginRequest, SignupRequest, DashboardStatsDTO, AnalyticsDTO
│       ├── entity/             # User, Role, Department, Course, CourseOffering,
│       │                      #   Enrollment, StudentProfile, FacultyProfile, LoginLog
│       │   └── enums/          # UserStatus, StudentStatus, FacultyStatus,
│       │                      #   OfferingStatus, EnrollmentStatus
│       ├── repository/         # Spring Data JPA repositories
│       ├── security/           # WebSecurityConfig (JWT filter chain)
│       └── service/            # Business logic layer
│
└── frontend-react/
    ├── index.html
    ├── package.json
    ├── tailwind.config.cjs
    └── src/
        ├── App.jsx / App.css / main.jsx / index.css
        ├── Components/
        │   ├── PageLoader.jsx
        │   ├── ThemeToggle.jsx
        │   └── charts/          # AreaChart, BarChart, BubbleChart, CalendarHeatmap,
        │                        #   CapacityGauges, DepartmentRadar, DonutChart,
        │                        #   ForceGraph, GroupedBarChart, HorizontalBarChart,
        │                        #   LineChart, PolarClock, WeekdayHeatmap
        ├── Layouts/MainLayouts.jsx
        ├── Pages/               # Analytics, Dashboards, Login, UsersManagement,
        │                        #   DepartmentsManagement, CoursesManagement,
        │                        #   CourseOfferingsManagement, Enrollment,
        │                        #   FacultyProfile, FacultyCourses, Grades,
        │                        #   StudentProfile
        ├── PrivateRoutes/PrivateRoute.jsx
        ├── Providers/           # AuthProvider.jsx, ThemeProvider.jsx
        ├── Routes/router.jsx
        ├── Services/api.js      # Centralized Axios instance
        └── assets/
```

---

## Prerequisites

- **Java 21** (JDK)
- **Maven** (or use the included `mvnw` / `mvnw.cmd` wrapper)
- **PostgreSQL** (running instance with a database created for the app)
- **Node.js** (LTS) and **npm**

---

## Getting Started

### Backend Setup

```bash
cd backend

# create a .env file in this directory (see Environment Variables below)

./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080` by default.

> A `dummy.sql` file is included for seeding sample data - run it against your PostgreSQL database after the schema has been created by Hibernate on first launch.

### Frontend Setup

```bash
cd frontend-react

npm install
npm run dev
```

The frontend will start on `http://localhost:5173` by default (Vite's default port).

To build for production:

```bash
npm run build
```

---

## Environment Variables

The backend uses **spring-dotenv**, so a `.env` file placed in the `backend/` directory will be picked up automatically. Example:

```env
DB_URL=jdbc:postgresql://localhost:5432/unims_db
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000
```

> Adjust property names to match whatever keys are referenced in `application.yml`.

---

## Roles & Access

| Role | Access |
|---|---|
| **Admin** | Full system access - manage users, departments, courses, offerings, and enrollments; view all analytics |
| **Faculty** | View assigned courses, manage grades for enrolled students, view/edit profile |
| **Student** | View enrolled courses, academic status, and personal dashboard; view/edit profile |

Access control is enforced via JWT claims validated on each protected backend route, and mirrored on the frontend through route guards (`PrivateRoute.jsx`) tied to the authenticated user's role.

---

## Analytics Dashboard

All charts are custom-built with D3.js (no charting library abstraction) and rendered on the admin analytics page:

- System Composition (User Distribution)
- Peak Login Hours (Polar Clock)
- User Registration Trend (Calendar Heatmap)
- Login Activity by Weekday (Weekday Heatmap)
- Faculty Hiring by Year
- Department Performance Radar
- Population by Department
- Courses per Department
- Offerings per Department
- Average Faculty Rating by Department
- Most Popular Courses
- Course Capacity Utilization (Gauges)
- Enrollment Status Breakdown
- Offering Status Breakdown
- Student CGPA Distribution
- Student Credits Completed
- Student Gender / Faculty Gender / Student Status (side-by-side demographics)
- Student Population Bubbles
- Department–Course Network (Force-Directed Graph)

---

## License

This project is proprietary. All rights reserved - no license is granted for reuse, redistribution, or modification without explicit permission.
