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
    <div className="min-h-screen w-full flex bg-[#020617] relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen grayscale-[0.5]"
        style={{
          backgroundImage: `url(${generatedImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 z-1" />
      
      {/* Left Content - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-start px-20 w-1/2 z-10 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            Enterprise Workflow
          </div>
          <h1 className="text-7xl font-bold tracking-tight text-white leading-tight">
            Elevate your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">productivity.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
            TaskFlow combines advanced role-based management with a seamless, polished interface designed for high-performance teams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8">
          <div className="space-y-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h3 className="text-white font-semibold">Secure RBAC</h3>
            <p className="text-sm text-slate-500">Enterprise-grade permission controls for your entire team.</p>
          </div>
          <div className="space-y-2">
            <Zap className="h-8 w-8 text-blue-400" />
            <h3 className="text-white font-semibold">Real-time Stats</h3>
            <p className="text-sm text-slate-500">Instantly monitor progress with live-updating dashboards.</p>
          </div>
        </div>
      </div>

      {/* Right Content - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
          <Card className="glass border-white/10 shadow-2xl overflow-hidden">
            <CardHeader className="space-y-1 pb-8">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <KeyRound className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="lg:hidden text-2xl font-bold tracking-tighter text-white">TaskFlow</div>
              </div>
              <CardTitle className="text-2xl font-bold text-white pt-6">
                {isRegistering ? "Create an account" : "Welcome back"}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {isRegistering 
                  ? "Enter your credentials to join the platform" 
                  : "Login to manage your enterprise workflows"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-5">
                {isRegistering && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                    <Input 
                      id="fullName" 
                      placeholder="John Doe" 
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary/20"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300">Username</Label>
                  <div className="relative">
                    <UserCircle2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input 
                      id="username" 
                      placeholder="Username" 
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary/20"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" title="password" className="text-slate-300">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••" 
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {isRegistering && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      placeholder="••••••••" 
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary/20"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-300">Default Role</Label>
                  <Select value={role} onValueChange={(val) => setRole(val as Role)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-primary/20">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (isRegistering ? "Creating account..." : "Signing in...") 
                    : (isRegistering ? "Create Account" : "Sign In")}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-6 mt-2">
              <div className="text-center w-full">
                <button 
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {isRegistering ? "Already have an account? " : "New to TaskFlow? "}
                  <span className="text-primary font-semibold hover:underline">
                    {isRegistering ? "Sign in" : "Create an account"}
                  </span>
                </button>
              </div>
              {!isRegistering && (
                <div className="text-center w-full">
                  <button 
                    type="button"
                    onClick={() => alert("Password reset link sent to your email!")}
                    className="text-xs text-slate-500 hover:text-primary transition-colors"
                  >
                    Trouble signing in? Reset password
                  </button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
