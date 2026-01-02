import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/task-context";
import { MOCK_USERS } from "@/lib/mock-data";
import { Task, Priority, Status } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateTaskModal() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { addTask } = useTasks();
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<{
    title: string;
    description: string;
    priority: Priority;
    assignedTo: string;
    dueDate: string;
  }>({
    defaultValues: {
      priority: "medium",
    }
  });

  // Only Admin and Managers can create tasks? The prompt didn't strictly say, 
  // but "Task CRUD" usually implies creation. Let's allow everyone to create 
  // but maybe only Managers+ can assign to others.
  
  const onSubmit = (data: any) => {
    addTask({
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: "todo",
      assignedTo: data.assignedTo ? parseInt(data.assignedTo) : null,
      createdBy: user!.id,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    });
    
    toast({
      title: "Task created",
      description: "New task has been added to the board.",
    });
    
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-create-task">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to the workflow.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" required {...register("title")} placeholder="e.g. Update Homepage" data-testid="input-task-title"/>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Details about the task..." />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(v) => setValue("priority", v as Priority)} defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select onValueChange={(v) => setValue("assignedTo", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Unassigned</SelectItem>
                  {MOCK_USERS.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register("dueDate")} />
          </div>

          <DialogFooter>
            <Button type="submit" data-testid="button-save-task">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
