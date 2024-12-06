import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input.tsx";
import { useToggle } from "@/hooks/useToggle.tsx";
import { useEffect, useState } from "react";
import Editor from "../../MarkDown/Editor.tsx";
import RightSide from "./RightSide.tsx";
import { TaskDialogInterface } from "./TaskDialog.ts";
import { ItemInterfaceType, StickersType } from "@/zodSchema/Project/tasks.ts";
import { cn } from "@/lib/utils.ts";
import { UniqueIdentifier } from "@dnd-kit/core";
import { getAllSticker } from "@/service/Stickers/api.ts";

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
}: TaskDialogInterface) {
  const { value: isOpen, toggleValue: toggleIsOpen } = useToggle();
  const [stickers, setStickers] = useState<StickersType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        setLoading(true);
        const data = await getAllSticker();
        console.log(data, "DATA MY MAN", currentTaskId);
        if (data) {
          const filteredStickers = stickers?.filter((sticker) =>
            sticker?.taskId?.includes(currentTaskId as string)
          );

          setStickers(filteredStickers); // Update state with stickers data
        }
      } catch (err) {
        console.error("Error fetching stickers:", err);
        setError("Failed to load stickers.");
      } finally {
        setLoading(false);
      }
    };

    fetchStickers(); // Call the fetch function on mount
  }, [open, currentTaskId]); // Empty dependency array to run only once on component mount

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
  return (
    <Dialog key={id} open={open} onOpenChange={close}>
      <DialogContent
        className="min-w-[800px]"
        aria-describedby={"Task dialog"}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <TitleView
              id={id}
              task={task!}
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
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {/* Faire un composant */}
        <section className="flex w-full min-h-[600px] gap-4">
          <section className="w-[75%] flex flex-col gap-12 ">
            {/* LABELS VIEWS */}
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {!error && !loading && <LabelsView stickers={stickers} />}
            {/* LABELS VIEWS */}
            <EditorView isOpen={isOpen} toggleIsOpen={toggleIsOpen} />
            <div>Remarques : Text area pour annoter</div>
          </section>
          <RightSide task={task} />
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
  currentTaskId,
  id,
  openChangeTaskTitle,
  setTaskTitle,
  handleChangeTaskTitle,
  inputTaskRef,
  taskTitle,
  task,
  containerId,
  setCurrentTaskId,
  toggleChangeTaskTitle,
}: TaskDialogInterface) => {
  return currentTaskId === id &&
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
      {/* Faire condition pour ouvrir l'editeur */}
      {isOpen ? (
        <section>
          {/* Ajouter un form pour l'editeur  */}
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
