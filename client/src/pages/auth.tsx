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
              <Label htmlFor="username">Username or Email</Label>
              <Input 
                id="username" 
                placeholder="alex@example.com" 
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
              <Label htmlFor="role">Registering as</Label>
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

            {isRegistering && role === "admin" && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
                <Label htmlFor="adminCode" className="text-yellow-700 dark:text-yellow-400 text-[10px] uppercase font-bold">Admin Invitation Code</Label>
                <Input 
                  id="adminCode" 
                  placeholder="Enter security code" 
                  className="bg-white border-yellow-200 focus:ring-yellow-500/20 dark:bg-slate-900 dark:border-yellow-900"
                  required
                />
              </div>
            )}

            {isRegistering && role === "manager" && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                <Label htmlFor="department" className="text-blue-700 dark:text-blue-400 text-[10px] uppercase font-bold">Department</Label>
                <Select defaultValue="engineering">
                  <SelectTrigger className="bg-white border-blue-200 dark:bg-slate-900 dark:border-blue-900">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isRegistering && role === "employee" && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                <Label htmlFor="referral" className="text-green-700 dark:text-green-400 text-[10px] uppercase font-bold">Manager Referral ID</Label>
                <Input 
                  id="referral" 
                  placeholder="optional" 
                  className="bg-white border-green-200 focus:ring-green-500/20 dark:bg-slate-900 dark:border-green-900"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 font-medium h-10 transition-colors" 
              disabled={isLoading}
            >
              {isLoading 
                ? (isRegistering ? "Creating account..." : "Signing in...") 
                : (isRegistering ? "Create Account" : "Sign In")}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="w-full h-10 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </Button>
              <Button type="button" variant="outline" className="w-full h-10 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </Button>
            </div>
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
