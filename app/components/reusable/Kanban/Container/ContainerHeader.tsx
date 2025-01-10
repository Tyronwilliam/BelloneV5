import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import { MutableRefObject } from "react";

export interface ContainerHeaderProps {
  id: string;
  title?: string;
  description?: string; 
  color?: string; 
  containerTitle?: string; 
  setContainerTitle?: (value: string) => void;
  changeContainerTitle?: (id: string, title: string) => void;
  toggleChangeTitle?: () => void; 
  currentIdTitle?: string | null;
  setCurrentIdTitle?: (value: string | null) => void; 
  openChangeTitle?: boolean; 
  inputTitleRef?: MutableRefObject<HTMLInputElement | null>;
  listeners?: any; 
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
            toggleChangeTitle && toggleChangeTitle(); 
            if (title?.trim() !== containerTitle?.trim()) {
              changeContainerTitle &&
                containerTitle &&
                changeContainerTitle(id, containerTitle); 
              toggleChangeTitle && toggleChangeTitle();
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
