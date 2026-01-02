import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Role } from "./types";
import { MOCK_USERS } from "./mock-data";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (username: string, role: Role, password?: string) => Promise<void>;
  registerUser: (username: string, fullName: string, role: Role, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem("taskflow_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("taskflow_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, role: Role, password?: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For the mockup, we'll store "registered" users in a simple local array-based simulation
    const storedUsersJson = localStorage.getItem("mock_registered_users");
    const registeredUsers: any[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    
    // Check against registered users first
    const foundUser = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userToSet: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        fullName: foundUser.fullName
      };
      setUser(userToSet);
      localStorage.setItem("taskflow_user", JSON.stringify(userToSet));
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userToSet.fullName} (${userToSet.role})`,
      });
      setIsLoading(false);
      return;
    }

    // Fallback to static mock users (admin/admin, etc)
    const staticUser = MOCK_USERS.find(
      (u) => u.username === username && u.username === password // mock: password is same as username for static
    );

    if (staticUser) {
      setUser(staticUser);
      localStorage.setItem("taskflow_user", JSON.stringify(staticUser));
      toast({
        title: "Welcome back!",
        description: `Logged in as ${staticUser.fullName} (${staticUser.role})`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Incorrect username or password.",
      });
      setIsLoading(false);
      throw new Error("Invalid credentials");
    }
    setIsLoading(false);
  };

  const registerUser = async (username: string, fullName: string, role: Role, password?: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const storedUsersJson = localStorage.getItem("mock_registered_users");
    const registeredUsers: any[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];

    if (registeredUsers.some(u => u.username === username)) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Username already exists.",
      });
      setIsLoading(false);
      throw new Error("User exists");
    }

    const newUser = {
      id: Math.floor(Math.random() * 1000) + 10,
      username,
      fullName,
      role,
      password
    };

    registeredUsers.push(newUser);
    localStorage.setItem("mock_registered_users", JSON.stringify(registeredUsers));

    const userToSet: User = {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      fullName: newUser.fullName
    };

    setUser(userToSet);
    localStorage.setItem("taskflow_user", JSON.stringify(userToSet));
    
    toast({
      title: "Account created",
      description: `Registered as ${userToSet.fullName} (${userToSet.role})`,
    });
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("taskflow_user");
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
