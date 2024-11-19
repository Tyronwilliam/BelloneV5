"use client";

import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DialogCustom } from "../Dialog/DialogCustom";

interface TaskData {
  id: string;
  content: string;
}

interface TaskProps {
  task: TaskData;
  index: number;
}

export const Task: React.FC<TaskProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: any) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2  "
        >
          <DialogCustom>
            <CardContent className="p-4 flex justify-between items-center cursor-pointer">
              <p>{task.content}</p>
              {/* <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4 z-50" />
              </Button> */}
            </CardContent>
          </DialogCustom>
        </Card>
      )}
    </Draggable>
  );
};
