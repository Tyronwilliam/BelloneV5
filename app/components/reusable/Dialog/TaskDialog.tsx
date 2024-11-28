import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Editor from "../MarkDown/Editor.tsx";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Input } from "@/components/ui/input.tsx";
import { MutableRefObject, useEffect } from "react";
import { DNDType } from "../Kanban/KanbanBoard.tsx";

export function TaskDialog({
  id,
  task,
  open,
  close,
  currentTaskId,
  handleChangeTaskTitle,
  setTaskTitle,
  inputTaskRef,
  taskTitle,
  setCurrentTaskId,
  toggleChangeTaskTitle,
  containerId,
  openChangeTaskTitle,
}: {
  id: UniqueIdentifier | undefined;
  task: any;
  open: boolean;
  close: () => void;
  containerId?: UniqueIdentifier;
  taskTitle?: string;
  setTaskTitle?: (e: any) => void;
  handleChangeTaskTitle?: (
    containerId: UniqueIdentifier,
    id: UniqueIdentifier | undefined,
    title: string | undefined
  ) => void;
  toggleChangeTaskTitle?: () => void;
  openChangeTaskTitle?: boolean;

  currentTaskId?: UniqueIdentifier | null;
  setCurrentTaskId?: (value: UniqueIdentifier | null) => void;
  inputTaskRef?: MutableRefObject<HTMLInputElement | null>;
}) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Save task title if clicked outside and the input is focused
      if (
        currentTaskId === id &&
        openChangeTaskTitle &&
        inputTaskRef &&
        inputTaskRef.current &&
        containerId &&
        !inputTaskRef.current.contains(event.target as Node)
      ) {
        if (task?.title?.trim() !== taskTitle?.trim()) {
          handleChangeTaskTitle &&
            handleChangeTaskTitle(containerId, id, taskTitle); // Save title
          toggleChangeTaskTitle && toggleChangeTaskTitle(); // Toggle edit mode
        }
      }
    };

    if (openChangeTaskTitle) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    openChangeTaskTitle,
    inputTaskRef,
    toggleChangeTaskTitle,
    handleChangeTaskTitle,
    id,
    taskTitle,
    containerId,
    currentTaskId,
  ]);

  return (
    <Dialog key={id} open={open} onOpenChange={close}>
      <DialogContent
        className="min-w-[800px]"
        aria-describedby={"custom dialog"}
      >
        <DialogHeader>
          <DialogTitle>
            {currentTaskId === id &&
            openChangeTaskTitle &&
            setTaskTitle &&
            handleChangeTaskTitle ? (
              <Input
                ref={inputTaskRef}
                key={id}
                type="text"
                name={id as string | undefined}
                placeholder={task?.title}
                value={taskTitle}
                onChange={(e: any) => setTaskTitle(e.target.value)}
                onBlur={() => {
                  if (containerId && taskTitle) {
                    handleChangeTaskTitle(containerId, id, taskTitle);
                  }
                }}
                className="max-w-[90%]"
              />
            ) : (
              <div
                className="text-gray-800 text-xl w-full"
                onClick={() => {
                  setCurrentTaskId && setCurrentTaskId(task?.id);
                  toggleChangeTaskTitle && toggleChangeTaskTitle();
                }}
              >
                {task?.title}
              </div>
            )}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* Editor Component - Assuming it handles the markdown editing */}
        <Editor />

        <DialogFooter className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={close}>
            Close
          </Button>
          <Button
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              // Handle saving changes or whatever needs to be done here
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
