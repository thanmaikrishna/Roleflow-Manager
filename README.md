# TaskFlow - Role-Based Workflow Management System

TaskFlow is a high-fidelity frontend prototype of an enterprise-grade task and workflow management system. Built with a focus on polished UI/UX and strict role-based state transitions.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Supports Admin, Manager, and Employee roles with specific permissions.
- **Strict Workflow Transitions**: 
  - **Employee**: Can move tasks from `To-Do` to `In Progress`.
  - **Manager**: Can move tasks from `In Progress` to `Review`.
  - **Admin**: Can move tasks from `Review` to `Done`.
- **Interactive Dashboard**: Visualizes task distribution using Recharts and highlights personal active tasks.
- **Kanban Board**: A multi-column view for tracking tasks across the entire lifecycle.
- **Polished Design**: Built with Tailwind CSS, Lucide icons, and Shadcn/UI components for a modern, enterprise feel.
- **Mock Authentication**: Simulate logins as different roles to test permission-based UI changes.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: Wouter
- **State Management**: React Context API
- **UI Components**: Radix UI + Shadcn/UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Validation**: React Hook Form + Zod

## 📖 How to Use

1. **Login**: Choose a username and a role (Admin, Manager, or Employee).
2. **View Dashboard**: Get an overview of all tasks and your specific assignments.
3. **Manage Tasks**: Go to the "Tasks" page to see the Kanban board.
4. **Transition Tasks**: Click the "Move to..." buttons on task cards. Notice how only certain transitions are allowed based on your selected role.

## 📂 Project Structure

- `client/src/lib/auth-context.tsx`: Handles mock authentication state.
- `client/src/lib/task-context.tsx`: Manages task state and local storage persistence.
- `client/src/lib/mock-data.ts`: Defines the transition logic and initial data.
- `client/src/pages/`: Contains the main application views (Auth, Dashboard, Tasks).

---
*Note: This is a frontend-only prototype. Data is persisted to LocalStorage for demonstration purposes.*
