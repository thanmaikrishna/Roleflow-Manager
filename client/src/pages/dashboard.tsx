import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/task-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/task-card";
import { CreateTaskModal } from "@/components/create-task-modal";
import { Status, Priority } from "@/lib/types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { CheckCircle2, Clock, ListTodo, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const myTasks = tasks.filter(t => t.assignedTo === user?.id && t.status !== 'done');
  
  const stats = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const chartData = [
    { name: 'To Do', count: stats.todo, color: '#94a3b8' },
    { name: 'In Prog', count: stats.in_progress, color: '#3b82f6' },
    { name: 'Review', count: stats.review, color: '#a855f7' },
    { name: 'Done', count: stats.done, color: '#22c55e' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Overview of your team's performance and workload.
            </p>
          </div>
          <CreateTaskModal />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total To-Do</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todo}</div>
              <p className="text-xs text-muted-foreground">Tasks awaiting start</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.in_progress}</div>
              <p className="text-xs text-blue-600/60 dark:text-blue-400/60 mt-1">Currently active</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">In Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.review}</div>
              <p className="text-xs text-purple-600/60 dark:text-purple-400/60 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.done}</div>
              <p className="text-xs text-green-600/60 dark:text-green-400/60 mt-1">Finished tasks</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-7 gap-4">
          {/* Main Chart */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* My Assigned Tasks */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>My Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {myTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mb-2 opacity-20" />
                  <p>All caught up!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
                  {myTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">{task.status.replace("_", " ")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
