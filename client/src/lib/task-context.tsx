import { Task, Status, Priority } from "./types";
import { MOCK_TASKS } from "./mock-data";
import React, { createContext, useContext, useEffect, useReducer } from "react";

type Action =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: number };

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

function taskReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case "SET_TASKS":
      return action.payload;
    case "ADD_TASK":
      return [...state, action.payload];
    case "UPDATE_TASK":
      return state.map((t) => (t.id === action.payload.id ? action.payload : t));
    case "DELETE_TASK":
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  useEffect(() => {
    // Load tasks from local storage or fallback to mock
    const storedTasks = localStorage.getItem("taskflow_tasks");
    if (storedTasks) {
      try {
        dispatch({ type: "SET_TASKS", payload: JSON.parse(storedTasks) });
      } catch (e) {
        dispatch({ type: "SET_TASKS", payload: MOCK_TASKS });
      }
    } else {
      dispatch({ type: "SET_TASKS", payload: MOCK_TASKS });
    }
  }, []);

  // Sync to local storage on changes
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_TASK", payload: newTask });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: "UPDATE_TASK", payload: task });
  };

  const deleteTask = (id: number) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
