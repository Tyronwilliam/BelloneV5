import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useToggle } from "@/hooks/useToggle.tsx";
import { cn } from "@/lib/utils.ts";
import { StickersType, TaskInterfaceType } from "@/zodSchema/Project/tasks";
import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Editor from "../../MarkDown/Editor.tsx";
import RightSide from "./RightSide.tsx";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import useClickOutside from "@/hooks/useClickOutside.tsx";
import { DNDType } from "../../Kanban/KanbanView.tsx";

export interface TaskDialogInterface {
  pseudoId: string;
  task: TaskInterfaceType;
  open: boolean;
  close: () => void;
  containerId: string;
  taskTitle: string;
  setTaskTitle?: (e: any) => void;
  handleChangeTaskTitle: (
    containerId: string,
    id: string,
    title: string
  ) => void;
  toggleChangeTaskTitle: () => void;
  openChangeTaskTitle?: boolean;
  currentTaskId?: string | null;
  setCurrentTaskId?: (value: string | null) => void;
  inputTaskRef?: MutableRefObject<HTMLInputElement | null>;
  setContainers?: Dispatch<SetStateAction<[] | DNDType[]>>;
}

export function TaskDialog({
  pseudoId,
  task,
  open,
  close,
  currentTaskId,
  handleChangeTaskTitle,
  setTaskTitle,
  inputTaskRef,
  taskTitle,
  containerId,
  setContainers,
}: TaskDialogInterface) {
  const { value: isOpen, toggleValue: toggleIsOpen } = useToggle();
  const { value: isChangeTitle, toggleValue: toggleIsChangeTitle } =
    useToggle();

  const handleUpdateTitleTask = () => {
    handleChangeTaskTitle(containerId, pseudoId, taskTitle);
    toggleIsChangeTitle();
  };
  useClickOutside(
    inputTaskRef as RefObject<HTMLInputElement>,
    () => handleUpdateTitleTask(),
    isChangeTitle
  );

  return (
    <Dialog key={pseudoId} open={open} onOpenChange={close}>
      <DialogContent
        className="min-w-[800px] z-50"
        aria-describedby={undefined}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <TitleView
              isChangeTitle={isChangeTitle}
              pseudoId={pseudoId}
              task={task}
              toggleIsChangeTitle={toggleIsChangeTitle}
              containerId={containerId}
              currentTaskId={currentTaskId as string}
              taskTitle={taskTitle}
              setTaskTitle={setTaskTitle!}
              inputTaskRef={inputTaskRef}
              handleChangeTaskTitle={handleChangeTaskTitle}
            />
          </DialogTitle>
        </DialogHeader>
        {/* Faire un composant */}
        <section className="flex w-full min-h-[600px] gap-4">
          <section className="w-[75%] flex flex-col gap-12 ">
            {/* LABELS VIEWS */}
            {/* {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {!error && !loading && <LabelsView stickers={stickers} />} */}
            {/* LABELS VIEWS */}
            <EditorView isOpen={isOpen} toggleIsOpen={toggleIsOpen} />
            <div>Remarques : Text area pour annoter</div>
          </section>
          <RightSide task={task} setContainers={setContainers} />
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

const TitleView = ({
  isChangeTitle,
  pseudoId,
  task,
  toggleIsChangeTitle,
  containerId,
  currentTaskId,
  taskTitle,
  setTaskTitle,
  inputTaskRef,
  handleChangeTaskTitle,
}: {
  isChangeTitle: boolean;
  pseudoId: string;
  task: TaskInterfaceType;
  toggleIsChangeTitle: () => void;
  containerId: string;
  currentTaskId: string;
  taskTitle: string;
  setTaskTitle: (e: any) => void;
  inputTaskRef?: MutableRefObject<HTMLInputElement | null>;
  handleChangeTaskTitle: (
    containerId: string,
    id: string,
    title: string
  ) => void;
}) => {
  return currentTaskId === pseudoId && isChangeTitle ? (
    <Input
      ref={inputTaskRef}
      key={pseudoId}
      type="text"
      name={pseudoId as string | undefined}
      placeholder={task?.title}
      value={taskTitle}
      onChange={(e: any) => setTaskTitle!(e.target.value)}
      onBlur={() => {
        handleChangeTaskTitle(containerId, pseudoId, taskTitle);
      }}
      className=" text-xl w-[90%]"
    />
  ) : (
    <div
      className="text-gray-800 text-xl w-[90%] cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        toggleIsChangeTitle();
      }}
    >
      {task?.title}
    </div>
  );
};

export const LabelsView = ({ stickers }: { stickers: StickersType[] }) => {
  console.log(stickers, "HELLO WORLD");
  if (stickers?.length === 0) return;
  return (
    <section className="flex gap-2 overflow-x-auto">
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className={cn(
            "rounded-sm p-2 text-sm w-fit text-white cursor-pointer hover:bg-opacity-85"
          )}
          style={{ backgroundColor: sticker.hexcode }}
        >
          {sticker.title}
        </div>
      ))}
    </section>
  );
};

const EditorView = ({
  isOpen,
  toggleIsOpen,
}: {
  isOpen: boolean;
  toggleIsOpen: () => void;
}) => {
  return (
    <section className="flex flex-col">
      <h2>Description</h2>
      {isOpen ? (
        <section>
          <Editor />
          <Button
            className="block ml-auto"
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Save changes
          </Button>
        </section>
      ) : (
        <Card
          className="w-full h-fit mt-2 mb-5 p-3 cursor-pointer rounded-sm"
          onClick={toggleIsOpen}
        >
          <CardContent className="w-full h-fit flex items-center p-0 m-0">
            <p>Write something</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
};
