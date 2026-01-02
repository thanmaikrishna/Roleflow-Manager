import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Role } from "./types";
import { MOCK_USERS } from "./mock-data";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (username: string, role: Role) => Promise<void>;
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

  const login = async (username: string, role: Role) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find(
      (u) => u.username === username && u.role === role
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("taskflow_user", JSON.stringify(foundUser));
      toast({
        title: "Welcome back!",
        description: `Logged in as ${foundUser.fullName} (${foundUser.role})`,
      });
    } else {
      // Create a mock user on the fly if not found in static list (mock registration)
      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 10,
        username,
        role,
        fullName: username.charAt(0).toUpperCase() + username.slice(1),
      };
      setUser(newUser);
      localStorage.setItem("taskflow_user", JSON.stringify(newUser));
      toast({
        title: "Account created",
        description: `Registered as ${newUser.fullName} (${newUser.role})`,
      });
    }
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
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
