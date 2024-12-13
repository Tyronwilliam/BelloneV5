import { Input } from "@/components/ui/input";
import { UniqueIdentifier } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { MutableRefObject } from "react";

export interface ContainerHeaderProps {
  id: UniqueIdentifier; // Unique identifier for the container
  title?: string; // The title of the container
  description?: string; // Optional description
  color?: string; // Background color for the container
  containerTitle?: string; // Title of the container when in edit mode
  setContainerTitle?: (value: string) => void; // Function to update the container title
  changeContainerTitle?: (id: UniqueIdentifier, title: string) => void; // Function to save the new title
  toggleChangeTitle?: () => void; // Function to toggle the edit mode
  currentIdTitle?: UniqueIdentifier | null; // Current active container being edited
  setCurrentIdTitle?: (value: UniqueIdentifier | null) => void; // Function to set the active container for editing
  openChangeTitle?: boolean; // Boolean to indicate if the title is being edited
  inputTitleRef?: MutableRefObject<HTMLInputElement | null>; // Ref for the input field
  listeners?: any; // DND Kit listeners for dragging
}

const ContainerHeader = ({
  id,
  title,
  description,
  color,
  containerTitle,
  setContainerTitle,
  changeContainerTitle,
  toggleChangeTitle,
  currentIdTitle,
  setCurrentIdTitle,
  openChangeTitle,
  inputTitleRef,
  listeners,
}: ContainerHeaderProps) => {
  return (
    <div
      className={`flex items-center justify-between p-2 rounded-md `}
      style={{ backgroundColor: `${color && color}` }}
    >
      {currentIdTitle === id &&
      openChangeTitle &&
      setContainerTitle &&
      changeContainerTitle ? (
        <Input
          ref={inputTitleRef}
          key={id}
          type="text"
          name={id as string | undefined}
          placeholder={title}
          value={containerTitle}
          onChange={(e: any) => setContainerTitle(e.target.value)}
          onBlur={() => {
            toggleChangeTitle && toggleChangeTitle(); // Toggle view
            if (title?.trim() !== containerTitle?.trim()) {
              changeContainerTitle &&
                containerTitle &&
                changeContainerTitle(id, containerTitle); // Save title
              toggleChangeTitle && toggleChangeTitle(); // Toggle view
            }
          }}
        />
      ) : (
        <h1
          className="text-gray-800 text-xl w-full"
          onClick={() => {
            setCurrentIdTitle && setCurrentIdTitle(id);
            title && setContainerTitle && setContainerTitle(title);
            toggleChangeTitle && toggleChangeTitle();
          }}
        >
          {title}
        </h1>
      )}

      <p className="text-gray-400 text-sm">{description}</p>
      <GripVertical
        className="w-5 h-5 text-gray-500 cursor-grab"
        {...listeners}
      />
    </div>
  );
};

export default ContainerHeader;
