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
import { Loader2 } from "lucide-react";

interface AddColumnProps {
  showAddContainerModal: boolean;
  setShowAddContainerModal: (arg: boolean) => void;
  containerName: string;
  setContainerName: (e: any) => void;
  onAddContainer: () => void;
  createColumnPending: boolean;
}

export const AddColumn = ({
  showAddContainerModal,
  setShowAddContainerModal,
  containerName,
  setContainerName,
  onAddContainer,
  createColumnPending,
}: AddColumnProps) => {
  return (
    <Dialog
      open={showAddContainerModal}
      onOpenChange={setShowAddContainerModal}
    >
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="w-fit p-4 bg-gray-50">
          Add a Column
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Add a Column</DialogTitle>
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
          </DialogClose>
          <Button onClick={onAddContainer}>
            {createColumnPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create a Column"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
