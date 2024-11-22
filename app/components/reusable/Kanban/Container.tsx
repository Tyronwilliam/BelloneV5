import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { UniqueIdentifier } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: () => void;
  openChangeTitle?: boolean;
  containerTitle?: string;
  setContainerTitle?: (e: any) => void;
  changeContainerTitle?: (
    id: UniqueIdentifier | undefined,
    title: string | undefined
  ) => void;
  toggleChangeTitle?: () => void;
  currentIdTitle?: UniqueIdentifier | null;
  setCurrentIdTitle?: (value: UniqueIdentifier | null) => void;
}

const Container = React.memo(
  ({
    id,
    children,
    title,
    description,
    onAddItem,
    openChangeTitle,
    containerTitle,
    setContainerTitle,
    changeContainerTitle,
    toggleChangeTitle,
    currentIdTitle,
    setCurrentIdTitle,
  }: ContainerProps) => {
    const {
      attributes,
      setNodeRef,
      listeners,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id,
      data: {
        type: "container", // Stable data reference
      },
    });

    // Memoize styles to prevent unnecessary re-renders
    const containerStyle = React.useMemo(
      () => ({
        transition,
        transform: CSS.Translate.toString(transform),
      }),
      [transform, transition]
    );

    return (
      <div
        {...attributes}
        ref={setNodeRef}
        style={containerStyle}
        className={clsx(
          "w-[280px] h-[370px] overflow-y-scroll p-4 bg-gray-50 rounded-xl flex flex-col gap-y-4 flex-shrink-0 mb-10 custom-scrollbar",
          isDragging && "opacity-50"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            {currentIdTitle === id &&
            openChangeTitle &&
            setContainerTitle &&
            changeContainerTitle ? (
              <Input
                type="text"
                name={id as string | undefined}
                placeholder={title}
                value={containerTitle}
                onChange={(e: any) => setContainerTitle(e.target.value)}
                onBlur={() => changeContainerTitle(id, containerTitle)} // Sauvegarde la valeur lors de la perte de focus
              />
            ) : (
              <h1
                className="text-gray-800 text-xl"
                onClick={() => {
                  setCurrentIdTitle && setCurrentIdTitle(id);
                  toggleChangeTitle && toggleChangeTitle();
                }}
              >
                {title}
              </h1>
            )}

            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          <GripVertical
            className="w-5 h-5 text-gray-500 cursor-grab"
            {...listeners}
          />
        </div>

        {children}

        {onAddItem && (
          <Button variant="ghost" onClick={onAddItem}>
            Add Item
          </Button>
        )}
      </div>
    );
  }
);

export default Container;
