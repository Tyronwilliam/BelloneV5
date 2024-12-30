import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Input from "./Input";
import { Dispatch } from "react";
import { Loader2 } from "lucide-react";

interface AddColumnProps {
  showAddItemModal: boolean;
  setShowAddItemModal: (arg: boolean) => void;
  taskTitle: string;
  setTaskTitle: (e: any) => void;
  onAddItem: () => void;
  createTaskPending: boolean;
}

export const AddTasks = ({
  showAddItemModal,
  setShowAddItemModal,
  taskTitle,
  setTaskTitle,
  onAddItem,
  createTaskPending,
}: AddColumnProps) => {
  return (
    <Dialog
      open={showAddItemModal}
      onOpenChange={() => {
        setTaskTitle("");
        setShowAddItemModal(!showAddItemModal);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Add a Task</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <Input
            type="text"
            placeholder="Name your task"
            name="taskTitle"
            value={taskTitle}
            onChange={(e: any) => setTaskTitle(e.target.value)}
          />
        </div>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>

          <Button onClick={onAddItem}>
            {createTaskPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create a Task"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
