import { ItemInterfaceType } from "@/zodSchema/Project/tasks";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { GripVertical } from "lucide-react";
import { MutableRefObject } from "react";
import { TaskDialog } from "../Dialog/Tasks/TaskDialog";

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  containerId?: UniqueIdentifier;
  item?: ItemInterfaceType;
  open?: boolean;
  close?: () => void;
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
};

const Items = ({
  id,
  title,
  item,
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
}: ItemsType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer",
        isDragging && "opacity-50"
      )}
    >
      <div
        className="flex items-center justify-between"
        onClick={() => {
          setCurrentTaskId && setCurrentTaskId(id);
          setTaskTitle && setTaskTitle(title);
          close && close();
          toggleChangeTaskTitle &&
            openChangeTaskTitle &&
            toggleChangeTaskTitle();
        }}
      >
        <span className="cursor-pointer w-full h-full">{title}</span>
        <GripVertical
          className="w-5 h-5 text-gray-500 cursor-grab shrink-0"
          {...listeners}
        />
      </div>
      {open && close && currentTaskId === id && (
        <TaskDialog
          id={currentTaskId}
          task={item!}
          open={open}
          close={close}
          containerId={containerId}
          currentTaskId={currentTaskId}
          setCurrentTaskId={setCurrentTaskId}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          inputTaskRef={inputTaskRef}
          handleChangeTaskTitle={handleChangeTaskTitle}
          openChangeTaskTitle={openChangeTaskTitle}
          toggleChangeTaskTitle={toggleChangeTaskTitle}
        />
      )}
    </div>
  );
};

export default Items;
