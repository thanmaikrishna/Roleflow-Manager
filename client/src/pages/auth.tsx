import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle2, KeyRound, Sparkles, ShieldCheck, Zap } from "lucide-react";
import generatedImage from '@assets/generated_images/abstract_glassmorphism_mesh_gradient_background.png'

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("employee");
  const { login, registerUser, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || (isRegistering && !password)) return;
    
    if (isRegistering && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      if (isRegistering) {
        await registerUser(username, fullName, role, password);
      } else {
        await login(username, role, password);
      }
      setLocation("/");
    } catch (err) {
      // Error handled by toast in context
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-950 font-sans">
      {/* Left Content - Simple Branding */}
      <div className="hidden lg:flex flex-col justify-center items-start px-24 w-1/2 bg-slate-50 dark:bg-slate-900/20 border-r border-slate-200 dark:border-slate-800">
        <div className="space-y-6">
          <div className="h-10 w-10 rounded-lg bg-slate-900 dark:bg-slate-50 flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-white dark:text-slate-900" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              TaskFlow
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
              Streamline your project management with intelligent role-based workflows and real-time progress tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Right Content - Clean Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in duration-500">
          <div className="lg:hidden space-y-4 text-center">
             <div className="mx-auto h-10 w-10 rounded-lg bg-slate-900 dark:bg-slate-50 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {isRegistering ? "Create an account" : "Sign in"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isRegistering 
                ? "Enter your details to join the platform" 
                : "Enter your credentials to manage your workflows"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  className="bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-900 dark:border-slate-800"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="username" 
                className="bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-900 dark:border-slate-800"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {!isRegistering && (
                  <button type="button" className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-50">
                    Forgot password?
                  </button>
                )}
              </div>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••" 
                className="bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-900 dark:border-slate-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isRegistering && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  placeholder="••••••••" 
                  className="bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-900 dark:border-slate-800"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val as Role)}>
                <SelectTrigger className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 font-medium h-10 transition-colors" 
              disabled={isLoading}
            >
              {isLoading 
                ? (isRegistering ? "Creating account..." : "Signing in...") 
                : (isRegistering ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              {isRegistering ? "Already have an account? " : "New here? "}
              <span className="font-semibold underline underline-offset-4">
                {isRegistering ? "Sign in" : "Create an account"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
