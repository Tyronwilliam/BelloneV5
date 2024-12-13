import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import React, { MutableRefObject, useEffect } from "react";
import ContainerHeader from "./Container/ContainerHeader";

interface ContainerProps {
  id: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: () => void;
  openChangeTitle?: boolean;
  containerTitle?: string;
  setContainerTitle?: (e: any) => void;
  changeContainerTitle?: (id: string, title: string | undefined) => void;
  toggleChangeTitle?: () => void;
  currentIdTitle?: string | null;
  setCurrentIdTitle?: (value: string | null) => void;
  inputTitleRef?: MutableRefObject<HTMLInputElement | null>;
  color?: string;
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
    inputTitleRef,
    color,
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
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          currentIdTitle === id &&
          openChangeTitle &&
          inputTitleRef &&
          inputTitleRef.current &&
          !inputTitleRef.current.contains(event.target as Node)
        ) {
          if (title?.trim() !== containerTitle?.trim()) {
            changeContainerTitle && changeContainerTitle(id, containerTitle); // Save title
            toggleChangeTitle && toggleChangeTitle(); // Toggle view
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [
      openChangeTitle,
      inputTitleRef,
      toggleChangeTitle,
      changeContainerTitle,
      id,
      containerTitle,
    ]);
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
        <ContainerHeader
          id={id}
          title={title}
          description={description}
          color={color}
          containerTitle={containerTitle}
          setContainerTitle={setContainerTitle}
          changeContainerTitle={changeContainerTitle}
          toggleChangeTitle={toggleChangeTitle}
          currentIdTitle={currentIdTitle}
          setCurrentIdTitle={setCurrentIdTitle}
          openChangeTitle={openChangeTitle}
          inputTitleRef={inputTitleRef}
          listeners={listeners}
        />
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
