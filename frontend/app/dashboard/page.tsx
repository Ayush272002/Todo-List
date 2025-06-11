"use client";

import type React from "react";

import { Suspense, useEffect, useState } from "react";
import {
  CheckCircle,
  Circle,
  Plus,
  Calendar,
  Search,
  Home,
  Users,
  LogOut,
  Menu,
  Bell,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Task } from "@/interface/Task";
import TaskItem from "@/components/TaskItem";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const router = useRouter();

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") return task.completed;
    if (activeTab === "incomplete") return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "newest") {
      return parseInt(b.id) - parseInt(a.id);
    } else if (sortOption === "oldest") {
      return parseInt(a.id) - parseInt(b.id);
    } else if (sortOption === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/v1/todos`, {
        withCredentials: true,
      });

      console.log("Fetched tasks:", res.data);

      const transformedTasks = res.data.map((todo: Task) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        dueDate: todo.dueDate || "",
        description: todo.description || "",
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/todos`,
        {
          title: newTaskTitle,
          details: newTaskDescription,
          dueDate: newTaskDueDate || null,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        console.log("Task added successfully:", res.data);
      }

      const newTask: Task = {
        id: res.data.id.toString(),
        title: res.data.title,
        description: res.data.details,
        completed: res.data.completed,
        dueDate: res.data.dueDate,
      };

      setTasks([newTask, ...tasks]);

      // Reset form and close dialog
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const updatedTask = { ...task, completed: !task.completed };

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/todos/${id}`,
        {
          title: updatedTask.title,
          details: updatedTask.description,
          dueDate: updatedTask.dueDate,
          completed: updatedTask.completed,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/todos/${id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Save edited task
  const saveEditedTask = async () => {
    if (!editingTask) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/todos/${editingTask.id}`,
        {
          title: editingTask.title,
          details: editingTask.description,
          dueDate: editingTask.dueDate,
          completed: editingTask.completed,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTasks(
          tasks.map((task) => (task.id === editingTask.id ? editingTask : task))
        );

        setEditingTask(null);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Handle quick add task
  const handleQuickAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/todos`,
        {
          title: newTaskTitle,
          details: "",
          dueDate: null,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        const newTask: Task = {
          id: response.data.id.toString(),
          title: response.data.title,
          description: response.data.details,
          completed: response.data.completed,
          dueDate: response.data.dueDate,
        };

        setTasks([newTask, ...tasks]);
        setNewTaskTitle("");
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        console.log("Logged out successfully");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-muted/50">
        {/* Mobile sidebar overlay */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-100 lg:hidden",
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center border-b px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-bold"
            >
              <CheckCircle className="h-6 w-6 text-primary" />
              <span>TaskFlow</span>
            </Link>
          </div>

          <div className="flex h-full flex-col gap-1 p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full bg-background pl-8"
                />
              </div>
            </div>

            <nav className="grid gap-1">
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link href="/dashboard">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link href="/dashboard/today">
                  <CheckCircle className="h-4 w-4" />
                  Today
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link href="/dashboard/upcoming">
                  <Calendar className="h-4 w-4" />
                  Upcoming
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link href="/dashboard/shared">
                  <Users className="h-4 w-4" />
                  Shared
                </Link>
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div
          className={cn(
            "flex min-h-screen flex-col lg:pl-64",
            sidebarOpen ? "lg:pl-64" : "lg:pl-0"
          )}
        >
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>

            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        John Doe
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        john.doe@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-2">
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="gap-2 cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                          Create a new task with details and options.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Task Title</Label>
                          <Input
                            id="title"
                            placeholder="Enter task title"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">
                            Description (Optional)
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Add more details about this task"
                            value={newTaskDescription}
                            onChange={(e) =>
                              setNewTaskDescription(e.target.value)
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">Due Date (Optional)</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddTask}>Add Task</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger className="cursor-pointer" value="all">
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        className="cursor-pointer"
                        value="incomplete"
                      >
                        To Do
                      </TabsTrigger>
                      <TabsTrigger className="cursor-pointer" value="completed">
                        Completed
                      </TabsTrigger>
                    </TabsList>

                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-[180px] cursor-pointer">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="newest">
                          Newest First
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="oldest">
                          Oldest First
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="dueDate">
                          Due Date
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <TabsContent value="all" className="mt-4 space-y-2">
                    {sortedTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4">
                          <CheckCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">
                          No tasks yet
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Add a new task to get started.
                        </p>
                      </div>
                    ) : (
                      sortedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={toggleTaskCompletion}
                          onDelete={deleteTask}
                          onEdit={(task) => {
                            setEditingTask(task);
                            setIsEditDialogOpen(true);
                          }}
                        />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="incomplete" className="mt-4 space-y-2">
                    {sortedTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4">
                          <CheckCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">
                          All tasks completed!
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          You've completed all your tasks. Great job!
                        </p>
                      </div>
                    ) : (
                      sortedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={toggleTaskCompletion}
                          onDelete={deleteTask}
                          onEdit={(task) => {
                            setEditingTask(task);
                            setIsEditDialogOpen(true);
                          }}
                        />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="mt-4 space-y-2">
                    {sortedTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4">
                          <Circle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">
                          No completed tasks
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Complete some tasks to see them here.
                        </p>
                      </div>
                    ) : (
                      sortedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={toggleTaskCompletion}
                          onDelete={deleteTask}
                          onEdit={(task) => {
                            setEditingTask(task);
                            setIsEditDialogOpen(true);
                          }}
                        />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Edit Task Dialog */}
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                      Make changes to your task here.
                    </DialogDescription>
                  </DialogHeader>
                  {editingTask && (
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-title">Task Title</Label>
                        <Input
                          id="edit-title"
                          value={editingTask.title}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-description">
                          Description (Optional)
                        </Label>
                        <Textarea
                          id="edit-description"
                          placeholder="Add more details about this task"
                          value={editingTask.description || ""}
                          onChange={(e: any) =>
                            setEditingTask({
                              ...editingTask,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4"></div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-dueDate">
                          Due Date (Optional)
                        </Label>
                        <Input
                          id="edit-dueDate"
                          type="date"
                          value={editingTask.dueDate || ""}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              dueDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveEditedTask} className="cursor-pointer">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
