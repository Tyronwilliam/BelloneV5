import { TaskInterfaceType } from "@/zodSchema/Project/tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { GripVertical } from "lucide-react";
import { MutableRefObject } from "react";
import { TaskDialog } from "../Dialog/Tasks/TaskDialog";

type ItemsType = {
  pseudoId: string;
  title: string;
  containerId?: string;
  item?: TaskInterfaceType;
  openEditor?: boolean;
  toggleOpenEditor?: () => void;
  taskTitle?: string;
  setTaskTitle?: (e: any) => void;
  handleChangeTaskTitle?: (
    containerId: string,
    id: string | undefined,
    title: string | undefined
  ) => void;
  toggleChangeTaskTitle?: () => void;
  openChangeTaskTitle?: boolean;
  currentTaskId?: string | null;
  setCurrentTaskId?: (value: string | null) => void;
  inputTaskRef?: MutableRefObject<HTMLInputElement | null>;
};

const Items = ({
  pseudoId,
  title,
  item,
  openEditor,
  toggleOpenEditor,
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
    id: pseudoId,
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
      onClick={() => {
        setCurrentTaskId && setCurrentTaskId(pseudoId);
        setTaskTitle && setTaskTitle(title);
        toggleOpenEditor && toggleOpenEditor();
        toggleChangeTaskTitle && openChangeTaskTitle && toggleChangeTaskTitle();
      }}
    >
      <div className="flex items-center justify-between">
        <span className="cursor-pointer w-full h-full">{title}</span>
        <GripVertical
          className="w-5 h-5 text-gray-500 cursor-grab shrink-0"
          {...listeners}
        />
      </div>
      {openEditor && currentTaskId === pseudoId && (
        <TaskDialog
          pseudoId={currentTaskId}
          task={item!}
          open={openEditor}
          close={toggleOpenEditor!}
          containerId={containerId!}
          currentTaskId={currentTaskId}
          setCurrentTaskId={setCurrentTaskId}
          taskTitle={taskTitle!}
          setTaskTitle={setTaskTitle}
          inputTaskRef={inputTaskRef}
          handleChangeTaskTitle={handleChangeTaskTitle!}
          openChangeTaskTitle={openChangeTaskTitle}
          toggleChangeTaskTitle={toggleChangeTaskTitle!}
        />
      )}
    </div>
  );
};

export default Items;
