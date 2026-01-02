import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/task-context";
import { TaskCard } from "@/components/task-card";
import { CreateTaskModal } from "@/components/create-task-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Status, Priority } from "@/lib/types";

export default function TasksPage() {
  const { tasks } = useTasks();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const columns: { id: Status; label: string }[] = [
    { id: "todo", label: "To Do" },
    { id: "in_progress", label: "In Progress" },
    { id: "review", label: "Review" },
    { id: "done", label: "Done" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
            <p className="text-muted-foreground">
              Manage and track project tasks across workflows.
            </p>
          </div>
          <CreateTaskModal />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-card border rounded-lg shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[500px]">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-border/50">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    {col.label}
                  </h3>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                
                <div className="flex flex-col gap-3">
                  {columnTasks.length === 0 ? (
                    <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground text-xs bg-muted/20">
                      No tasks
                    </div>
                  ) : (
                    columnTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
