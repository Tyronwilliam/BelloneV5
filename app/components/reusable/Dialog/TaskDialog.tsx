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
  useEffect(() => {
    inputTaskRef?.current && inputTaskRef?.current?.focus();
  }, [toggleChangeTaskTitle]);
  return (
    <Dialog key={id} open={open} onOpenChange={close}>
      <DialogContent
        className="min-w-[800px]"
        aria-describedby={"custom dialog"}
      >
        <DialogHeader>
          <DialogTitle className="mx-auto w-[550px]">
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
              />
            ) : (
              <div
                className="text-gray-800 text-xl w-[90%] cursor-pointer"
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
        {/* Faire un composant */}
        <section className="mx-auto w-[550px] flex flex-col gap-12 ">
          <section className="flex gap-2 overflow-x-auto ">
            <div className="bg-orange-500 rounded-sm p-2 text-sm w-fit text-white cursor-pointer  hover:bg-opacity-85">
              Urgent
            </div>
            <div className="bg-green-500 rounded-sm p-2 text-sm text-white font-semibold w-fit cursor-pointer  hover:bg-opacity-85">
              Done
            </div>
          </section>
          <section className="flex flex-col">
            <h2>Description</h2>
            {/* Faire condition pour ouvrir l'editeur */}
            <Editor />
            <section className=" flex justify-end w-[550px] mx-auto">
              <Button
                type="submit"
                onClick={(e) => {
                  e.stopPropagation();
                  // On sauvegarde l'Editeur
                }}
              >
                Save changes
              </Button>
            </section>{" "}
          </section>
          <div>Remarques : Text area pour annoter</div>
        </section>{" "}
        <DialogFooter className="flex items-center gap-2 w-[550px] mx-auto">
          <Button type="button" variant="secondary" onClick={close}>
            Close
          </Button>
        </DialogFooter>{" "}
      </DialogContent>
    </Dialog>
  );
}
