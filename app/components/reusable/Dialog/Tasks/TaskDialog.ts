import { ItemInterfaceType } from "@/zodSchema/Project/tasks";
import { UniqueIdentifier } from "@dnd-kit/core";
import { MutableRefObject } from "react";

export interface TaskDialogInterface {
  id: UniqueIdentifier | undefined;
  task: ItemInterfaceType;
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
}
