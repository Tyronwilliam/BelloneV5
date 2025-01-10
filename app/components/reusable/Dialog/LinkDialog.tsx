import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  textUrl: string;
  setTextUrl: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  onInsert: (textUrl: string, url: string) => void;
}

const LinkDialog: React.FC<LinkDialogProps> = ({
  isOpen,
  onClose,
  textUrl,
  setTextUrl,
  url,
  setUrl,
  onInsert,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-label="custom-dialog-link-editor">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
          <DialogDescription>
            Enter the URL for the link you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 flex flex-col">
          <Input
            value={textUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTextUrl(e.target.value)
            }
            placeholder="Mon lien"
            className="w-full"
          />
          <Input
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUrl(e.target.value)
            }
            placeholder="https://example.com"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onInsert(textUrl, url);
            }}
          >
            Insert Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
