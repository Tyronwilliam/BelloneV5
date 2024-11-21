"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export const AddTask: React.FC<{
  newTask: string;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
  columns: any[];
  setColumns: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ newTask, setNewTask, columns, setColumns }) => {
  const addTask = () => {
    if (newTask.trim() !== "") {
      const updatedColumns = [...columns];
      // Generate a unique task ID using a counter
      const taskId = updatedColumns[0].tasks.length + 1; // This will increment the task ID for each new task

      updatedColumns[0].tasks.push({
        id: taskId, // Use the unique integer as the task ID
        content: newTask,
      });

      setColumns(updatedColumns);
      setNewTask(""); // Clear the input field after adding the task
    }
  };

  return (
    <div className="flex mb-4 space-x-2">
      <Input
        type="text"
        placeholder="Add a new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="flex-grow"
      />
      <Button onClick={addTask}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Task
      </Button>
    </div>
  );
};
