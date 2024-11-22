import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { GripVertical } from "lucide-react";
import { DialogCustom } from "../Dialog/DialogCustom";

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  item?: any;
  open?: boolean;
  close?: () => void;
  currentIdTask?: UniqueIdentifier;
  setCurrentIdTask?: (id: UniqueIdentifier) => void;
};

const Items = ({
  id,
  title,
  item,
  open,
  close,
  setCurrentIdTask,
  currentIdTask,
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
          setCurrentIdTask && setCurrentIdTask(id);
          close && close();
        }}
      >
        {open && close && currentIdTask === id && (
          <DialogCustom
            id={currentIdTask}
            task={item}
            open={open}
            close={close}
          />
        )}
        {title}
        <GripVertical
          className="w-5 h-5 text-gray-500 cursor-grab"
          {...listeners}
        />
      </div>
    </div>
  );
};

export default Items;
