import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input.tsx";
import { UniqueIdentifier } from "@dnd-kit/core";
import { MutableRefObject, useEffect, useState } from "react";
import Editor from "../../MarkDown/Editor.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RightSide from "./RightSide.tsx";

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
  const [isOpen, setIsOpen] = useState(false);
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
                className=" text-xl w-[90%]"
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
        <section className="flex w-full min-h-[600px] gap-4">
          <section className="w-[75%] flex flex-col gap-12 ">
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
              {isOpen ? (
                <section>
                  <Editor />
                  <Button
                    className="block ml-auto"
                    type="submit"
                    onClick={(e) => {
                      e.stopPropagation();
                      // On sauvegarde l'Editeur
                    }}
                  >
                    Save changes
                  </Button>
                </section>
              ) : (
                <Card
                  className="w-full h-fit mt-2 mb-5 p-3 cursor-pointer rounded-sm"
                  onClick={() => setIsOpen(true)}
                >
                  <CardContent className="w-full h-fit flex items-center p-0 m-0">
                    <p>Write something</p>
                  </CardContent>
                </Card>
              )}
            </section>
            <div>Remarques : Text area pour annoter</div>
          </section>
          <RightSide />
        </section>
        <DialogFooter className="flex items-center gap-2 w-full">
          <Button type="button" variant="secondary" onClick={close}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
