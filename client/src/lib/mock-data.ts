import { Task, User, Role, Status } from "./types";

export const MOCK_USERS: User[] = [
  { id: 1, username: "admin", role: "admin", fullName: "Alice Admin" },
  { id: 2, username: "manager", role: "manager", fullName: "Bob Manager" },
  { id: 3, username: "employee", role: "employee", fullName: "Charlie Employee" },
  { id: 4, username: "dave", role: "employee", fullName: "Dave Developer" },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: "Implement Login Page",
    description: "Create the login form with validation and error handling.",
    status: "done",
    priority: "high",
    assignedTo: 3,
    createdBy: 2,
    dueDate: "2023-10-15T00:00:00.000Z",
    createdAt: "2023-10-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Design Dashboard Layout",
    description: "Create a responsive layout for the main dashboard.",
    status: "review",
    priority: "medium",
    assignedTo: 3,
    createdBy: 2,
    dueDate: "2023-10-20T00:00:00.000Z",
    createdAt: "2023-10-02T11:00:00.000Z",
  },
  {
    id: 3,
    title: "API Integration for Tasks",
    description: "Connect the frontend task list to the backend API.",
    status: "in_progress",
    priority: "high",
    assignedTo: 4,
    createdBy: 2,
    dueDate: "2023-10-25T00:00:00.000Z",
    createdAt: "2023-10-05T09:30:00.000Z",
  },
  {
    id: 4,
    title: "Update Documentation",
    description: "Update the README and API docs.",
    status: "todo",
    priority: "low",
    assignedTo: null,
    createdBy: 1,
    dueDate: "2023-11-01T00:00:00.000Z",
    createdAt: "2023-10-10T14:15:00.000Z",
  },
];

export const TRANSITION_RULES: Record<Role, Status[]> = {
  employee: ["todo", "in_progress"], // Can move FROM todo TO in_progress
  manager: ["in_progress", "review"], // Can move FROM in_progress TO review
  admin: ["review", "done"], // Can move FROM review TO done
};

export const canTransition = (role: Role, currentStatus: Status, newStatus: Status): boolean => {
  // Admins can do anything in this simplified model? 
  // No, strict rules as per requirements:
  // Employee: To-Do -> In Progress
  // Manager: In Progress -> Review
  // Admin: Review -> Done
  
  // Exception: Let's allow backward movement for higher roles or same role if needed for realism,
  // but strictly following the prompt's "Enforce workflow transitions":
  
  if (role === "employee" && currentStatus === "todo" && newStatus === "in_progress") return true;
  if (role === "manager" && currentStatus === "in_progress" && newStatus === "review") return true;
  if (role === "admin" && currentStatus === "review" && newStatus === "done") return true;
  
  // Allow moving back? Prompt didn't specify, but usually needed. 
  // Let's stick to the prompt's positive constraints for now to demonstrate strictness.
  
  return false;
};

// Helper to get available next status based on role and current status
export const getAvailableTransitions = (role: Role, currentStatus: Status): Status[] => {
  if (role === "employee" && currentStatus === "todo") return ["in_progress"];
  if (role === "manager" && currentStatus === "in_progress") return ["review"];
  if (role === "admin" && currentStatus === "review") return ["done"];
  return [];
};
