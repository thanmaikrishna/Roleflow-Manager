import { Task, User, Role, Status } from "./types";

export const MOCK_USERS: User[] = [
  { id: 1, username: "admin", role: "admin", fullName: "Alice Admin" },
  { id: 2, username: "manager", role: "manager", fullName: "Bob Manager" },
  { id: 3, username: "employee", role: "employee", fullName: "Charlie Employee" },
  { id: 4, username: "dave", role: "employee", fullName: "Dave Developer" },
];

export const MOCK_TASKS: Task[] = [];

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
