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

interface AddColumnProps {
  showAddItemModal: boolean;
  setShowAddItemModal: (arg: boolean) => void;
  itemName: string;
  setItemName: (e: any) => void;
  onAddItem: () => void;
}

export const AddTasks = ({
  showAddItemModal,
  setShowAddItemModal,
  itemName,
  setItemName,
  onAddItem,
}: AddColumnProps) => {
  return (
    <Dialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Add a Task</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <Input
            type="text"
            placeholder="Item Title"
            name="itemname"
            value={itemName}
            onChange={(e: any) => setItemName(e.target.value)}
          />
        </div>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>{" "}
          <Button onClick={onAddItem}>Create a Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
