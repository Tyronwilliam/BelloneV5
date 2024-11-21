"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export const AddColumn: React.FC<{
  newColumnTitle: string;
  setNewColumnTitle: React.Dispatch<React.SetStateAction<string>>;
  columns: any[];
  setColumns: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ newColumnTitle, setNewColumnTitle, columns, setColumns }) => {
  const addColumn = () => {
    if (newColumnTitle.trim() !== "") {
      const updatedColumns = [...columns];

      // Generate a unique column ID by using the length of the existing columns
      const columnId = updatedColumns.length + 1; // This will give each column a unique ID

      const newColumn = {
        id: columnId, // Use the unique column ID
        title: newColumnTitle,
        tasks: [],
      };

      setColumns([...updatedColumns, newColumn]); // Add the new column to the state
      setNewColumnTitle(""); // Clear the input field
    }
  };

  return (
    <div className="flex mb-4 space-x-2">
      <Input
        type="text"
        placeholder="New column title"
        value={newColumnTitle}
        onChange={(e) => setNewColumnTitle(e.target.value)}
        className="flex-grow"
      />
      <Button onClick={addColumn}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Column
      </Button>
    </div>
  );
};
