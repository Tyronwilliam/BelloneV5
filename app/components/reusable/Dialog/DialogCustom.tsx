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
import { ReactNode } from "react";
import Editor from "../MarkDown/Editor.tsx";

export function DialogCustom({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="min-w-[800px]"
        aria-describedby={"custom dialog"}
      >
        <DialogHeader>
          <DialogTitle>Custom Your Task</DialogTitle>
          <DialogDescription>Description of the Task </DialogDescription>
        </DialogHeader>
        <Editor />
        <DialogFooter className="flex items-center gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
