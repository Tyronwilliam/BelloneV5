"use client";
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Task } from "./Task";
import { GripVertical } from "lucide-react";
import { ColumnData } from "./KanbanBoard";

interface ColumnProps {
  column: ColumnData;
  index: number;
}

export const Column: React.FC<ColumnProps> = ({ column, index }) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className=" border-[1px] bg-white p-4 rounded-lg w-72 flex-shrink-0 h-fit"
        >
          <div
            className="flex items-center mb-4  rounded-sm p-2"
            {...provided.dragHandleProps}
            style={{ backgroundColor: column.color }}
          >
            <GripVertical className="mr-2 h-5 w-5 text-gray-500" />
            <h2 className="font-semibold">{column.title}</h2>
          </div>
          <Droppable
            droppableId={column.id}
            type="task"
            direction="vertical"
            isDropDisabled={false} // Ensuring isDropDisabled is a boolean
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[200px]"
              >
                {column.tasks.map((task, taskIndex) => (
                  <Task key={task.id} task={task} index={taskIndex} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
