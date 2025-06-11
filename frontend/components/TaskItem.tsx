import { Task } from "@/interface/Task";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Calendar,
  CheckCircle,
  Circle,
  Edit,
  MoreHorizontal,
  Trash,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const hasDescription = task.description && task.description.trim() !== "";

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border p-3 transition-colors cursor-pointer",
          task.completed ? "bg-muted/50" : "bg-background"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 rounded-full p-0"
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        <div
          className="flex-1 space-y-1"
          onClick={() => setIsDetailsOpen(true)}
        >
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "font-medium",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </p>
            {hasDescription && (
              <Info className="h-3 w-3 text-muted-foreground" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsDetailsOpen(true)} className="cursor-pointer">
              <Info className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              className="text-red-500 cursor-pointer"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={cn(task.completed && "line-through")}>
              {task.title}
            </DialogTitle>
            <DialogDescription>
              {task.completed ? "Completed" : "Incomplete"}
              {task.dueDate
                ? ` • Due ${new Date(task.dueDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {hasDescription ? (
              <div className="text-sm whitespace-pre-wrap">
                {task.description}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description provided.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailsOpen(false);
                onEdit(task);
              }}
            >
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskItem;
