"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Timer, User, X } from "lucide-react";
import { BiDuplicate } from "react-icons/bi";

import { DateInput } from "@/app/(fonctionnality)/project/Form/reusable/DateInput";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useToggle } from "@/hooks/useToggle";
import {
  ItemInterfaceType,
  StickersInterface,
  TaskFormDialogSchema,
  TaskFormDialogType,
} from "@/zodSchema/Project/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef } from "react";
import MembersModal from "./RightSIdeItem/MembersModal";
import useCollaborator from "@/hooks/useCollaborator";

const RightSide = ({ task }: { task: ItemInterfaceType }) => {
  const projectId = "676d3c3ed610fd3d18462e24";
  const form = useForm<z.infer<typeof TaskFormDialogSchema>>({
    resolver: zodResolver(TaskFormDialogSchema),
    defaultValues: {
      start_date: task?.start_date || "",
      completeAt: task?.completeAt || "",
      members: [],
      time: task?.time || 0,
    },
  });
  const stickerForm = useForm<z.infer<typeof StickersInterface>>({
    resolver: zodResolver(StickersInterface),
    defaultValues: {
      hexcode: "",
      title: "",
      taskId: [],
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  const { value: openMembers, toggleValue: toggleMembers } = useToggle();
  const inputMemberRef = useRef<HTMLDivElement | null>(null);

  function onSubmit(data: TaskFormDialogType) {
    toast({
      title: "You submitted the following values:",
      description: "Sucess",
    });
  }
  const { handleGetCollaboratorByProjectId } = useCollaborator();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputMemberRef.current &&
        !inputMemberRef.current.contains(event.target as Node)
      ) {
        toggleMembers();
      }
    };

    if (openMembers) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMembers]);
  //FAIRE FONCTION DISTINCTE POUR CHAQUE ETAPE POUR EVITER LE SOUCIS DES STATES
  const addClientToDatabase = async () => {};

  return (
    <section className="w-1/4 h-full  p-2">
      <section className="w-full flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <DateInput
              control={form.control}
              name={"start_date"}
              label={"Date"}
              isTasksDialog={true}
            />{" "}
            <MembersModal
              control={form.control}
              name={"members"}
              toggleMembers={toggleMembers}
              openMembers={openMembers}
              inputMemberRef={inputMemberRef}
              placeholder="Search for members"
              className="rounded-none"
              members={task?.members}
              handleGetCollaboratorByProjectId={
                handleGetCollaboratorByProjectId
              }
              projectId={projectId}
            />
            <DateInput
              control={form.control}
              name={"completeAt"}
              label={"Complete At"}
              isTasksDialog={true}
            />
          </form>
          {/* <SelectableWithCreation
            control={stickerForm.control}
            name="stickers"
            label="Labels"
            placeholder="Look for label"
            options={task?.members}
            isLoading={isLoading}
            addToDatabase={addClientToDatabase}
            isAddingNew={isAddingNew}
            newData={newData}
            handleChange={handleChange}
            toggleValue={toggleValue}
            inputPlaceholder="Add a label"
            addButtonLabel="Add New Label"
            saveButtonLabel="Save Label"
            cancelButtonLabel="Cancel"
            isPopover={true}
            icon={<Ticket />}
          /> */}
          <Button
            variant="outline"
            className="w-full text-wrap flex justify-start "
          >
            <Timer /> Timer
          </Button>
          <Button
            variant="outline"
            className="w-full text-wrap flex justify-start "
          >
            <BiDuplicate /> Dupliquer
          </Button>
        </Form>
      </section>
    </section>
  );
};

export default RightSide;
