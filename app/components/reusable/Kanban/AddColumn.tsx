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
  showAddContainerModal: boolean;
  setShowAddContainerModal: (arg: boolean) => void;
  containerName: string;
  setContainerName: (e: any) => void;
  onAddContainer: () => void;
}

export const AddColumn = ({
  showAddContainerModal,
  setShowAddContainerModal,
  containerName,
  setContainerName,
  onAddContainer,
}: AddColumnProps) => {
  return (
    <Dialog
      open={showAddContainerModal}
      onOpenChange={setShowAddContainerModal}
    >
      <DialogTrigger asChild>
        <Button>Add a list</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Add a list</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <Input
            type="text"
            placeholder="Container Title"
            name="containername"
            value={containerName}
            onChange={(e: any) => setContainerName(e.target.value)}
          />
        </div>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>{" "}
          <Button onClick={onAddContainer}>Create a list</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
