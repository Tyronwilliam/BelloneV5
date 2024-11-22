"use client";

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
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Editor from "../MarkDown/Editor.tsx";
import { UniqueIdentifier } from "@dnd-kit/core";
// const Editor = dynamic(() => import("../MarkDown/Editor.tsx"));

export function DialogCustom({
  id,
  task,
  open,
  close,
}: {
  id: UniqueIdentifier | undefined;
  task: any;
  open: boolean;
  close: () => void;
}) {
  console.log(task, id);
  return (
    <Dialog key={id} open={open} onOpenChange={close}>
      <DialogContent
        className="min-w-[800px]"
        aria-describedby={"custom dialog"}
      >
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Editor />
        <DialogFooter className="flex items-center gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={close}>
              Close
            </Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
