export type Role = "admin" | "manager" | "employee";

export type Status = "todo" | "in_progress" | "review" | "done";

export type Priority = "low" | "medium" | "high";

export interface User {
  id: number;
  username: string;
  role: Role;
  fullName: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignedTo: number | null; // User ID
  createdBy: number; // User ID
  dueDate: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}
