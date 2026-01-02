import { formatDistanceToNow } from "date-fns";
import { Task, Role, Status, User } from "@/lib/types";
import { canTransition, getAvailableTransitions, MOCK_USERS } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/task-context";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { user } = useAuth();
  const { updateTask, deleteTask } = useTasks();
  const { toast } = useToast();

  const assignedUser = MOCK_USERS.find((u) => u.id === task.assignedTo);
  
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const statusColors = {
    todo: "border-l-4 border-l-slate-400",
    in_progress: "border-l-4 border-l-blue-500",
    review: "border-l-4 border-l-purple-500",
    done: "border-l-4 border-l-green-500 opacity-75",
  };

  const handleStatusChange = (newStatus: Status) => {
    if (!user) return;
    
    if (canTransition(user.role, task.status, newStatus)) {
      updateTask({ ...task, status: newStatus });
      toast({
        title: "Status updated",
        description: `Task moved to ${newStatus.replace("_", " ")}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: `${user.role}s cannot move tasks from ${task.status} to ${newStatus}`,
      });
    }
  };

  const availableTransitions = user ? getAvailableTransitions(user.role, task.status) : [];

  return (
    <Card className={`group relative hover:shadow-md transition-all duration-200 ${statusColors[task.status]}`}>
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={`${priorityColors[task.priority]} border-none capitalize`}>
            {task.priority}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableTransitions.map((status) => (
                <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)}>
                  Move to {status.replace("_", " ")}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => deleteTask(task.id)}
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="font-semibold leading-tight">{task.title}</h3>
      </CardHeader>
      <CardContent className="p-4 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1" title="Due Date">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>
        
        {assignedUser ? (
           <Avatar className="h-6 w-6 border border-background" title={`Assigned to ${assignedUser.fullName}`}>
             <AvatarFallback className="text-[10px]">
               {assignedUser.username.substring(0, 2).toUpperCase()}
             </AvatarFallback>
           </Avatar>
        ) : (
          <div className="h-6 w-6 rounded-full border border-dashed border-muted-foreground/50 flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground">?</span>
          </div>
        )}
      </CardFooter>
      
      {/* Quick Action Button for Primary Transition */}
      {availableTransitions.length > 0 && (
        <div className="absolute bottom-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-7 text-xs gap-1 shadow-sm"
            onClick={() => handleStatusChange(availableTransitions[0])}
          >
            {availableTransitions[0].replace("_", " ")} <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      )}
    </Card>
  );
}
