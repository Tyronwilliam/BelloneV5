"use client";

import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { AddColumn } from "./AddColumn";
import { AddTask } from "./AddTask";
import { Column } from "./Column";

interface Task {
  id: string;
  content: string;
}

export interface ColumnData {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

const initialColumns: ColumnData[] = [
  {
    id: "column-1",
    title: "To Do",
    tasks: [
      { id: "task-1", content: "Create project plan" },
      { id: "task-2", content: "Design UI mockups" },
    ],
    color: "#FADADD",
  },
  {
    id: "column-2",
    title: "In Progress",
    tasks: [{ id: "task-3", content: "Implement authentication" }],
    color: "#AEC6CF",
  },
  {
    id: "column-3",
    title: "Done",
    tasks: [{ id: "task-4", content: "Set up project repository" }],
    color: "#B2F2BB", // Pastel Green
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);
  const [newTask, setNewTask] = useState<string>("");
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // Handle column reorder
    if (type === "column") {
      handleColumnReorder(source, destination);
      return;
    }

    // Handle task reorder
    if (source.droppableId !== destination.droppableId) {
      handleTaskMoveBetweenColumns(source, destination);
    } else {
      handleTaskReorderWithinColumn(source, destination);
    }
  };

  // Reorder columns
  const handleColumnReorder = (source: any, destination: any) => {
    const newColumns = Array.from(columns);
    const [reorderedColumn] = newColumns.splice(source.index, 1);
    newColumns.splice(destination.index, 0, reorderedColumn);
    setColumns(newColumns);
  };

  // Move task between columns
  const handleTaskMoveBetweenColumns = (source: any, destination: any) => {
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return; // safeguard in case columns are not found

    const sourceItems = [...sourceColumn.tasks];
    const destItems = [...destColumn.tasks];

    // Remove the task from the source column
    const [removedTask] = sourceItems.splice(source.index, 1);

    // Insert the task into the destination column at the destination index
    destItems.splice(destination.index, 0, removedTask);

    // Update the columns state with the new task order
    setColumns(
      columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceItems };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destItems };
        }
        return col;
      })
    );
  };

  // Reorder tasks within the same column
  const handleTaskReorderWithinColumn = (source: any, destination: any) => {
    const column = columns.find((col) => col.id === source.droppableId);

    if (!column) return; // safeguard in case column is not found

    const copiedItems = [...column.tasks];

    // Remove the task from the source index
    const [removedTask] = copiedItems.splice(source.index, 1);

    // Insert the task into the destination position
    copiedItems.splice(destination.index, 0, removedTask);

    // Update the column's tasks with the new order
    setColumns(
      columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: copiedItems };
        }
        return col;
      })
    );
  };

  return (
    <div className="h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <AddTask
        newTask={newTask}
        setNewTask={setNewTask}
        columns={columns}
        setColumns={setColumns}
      />
      <AddColumn
        newColumnTitle={newColumnTitle}
        setNewColumnTitle={setNewColumnTitle}
        columns={columns}
        setColumns={setColumns}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="board"
          type="column"
          direction="horizontal"
          isDropDisabled={false} // Ensuring isDropDisabled is a boolean
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="custom-scrollbar flex space-x-4 overflow-x-auto pb-4"
              style={{ height: "calc(100% - 145px)" }}
            >
              {columns.map((column, index) => (
                <Column key={column.id} column={column} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
