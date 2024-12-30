"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Timer } from "lucide-react";
import { BiDuplicate } from "react-icons/bi";

import { DateInput } from "@/app/(fonctionnality)/project/Form/reusable/DateInput";
import { toast } from "@/hooks/use-toast";
import useClickOutside from "@/hooks/useClickOutside";
import { useToggle } from "@/hooks/useToggle";
import {
  TaskInterfaceType,
  StickerFormInterface,
  StickersInterface,
  TaskFormDialogSchema,
  TaskFormDialogType,
} from "@/zodSchema/Project/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MembersModal from "./RightSIdeItem/MembersModal";
import ApiRequest from "@/service";

const RightSide = ({ task }: { task: TaskInterfaceType }) => {
  const projectId = "676d3c3ed610fd3d18462e24";
  const { data, error, isLoading } =
    ApiRequest.Collabo.GetCollaboByProjectId.useQuery(projectId);
  const { value: openMembers, toggleValue: toggleMembers } = useToggle();
  const memberModalRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(memberModalRef, () => toggleMembers(), openMembers);

  const form = useForm<z.infer<typeof TaskFormDialogSchema>>({
    resolver: zodResolver(TaskFormDialogSchema),
    defaultValues: {
      start_date: task?.start_date || "",
      completeAt: task?.completeAt || "",
      members: [],
      time: task?.time || 0,
    },
  });
  const stickerForm = useForm<z.infer<typeof StickerFormInterface>>({
    resolver: zodResolver(StickerFormInterface),
    defaultValues: {
      hexcode: "",
      title: "",
      taskId: [],
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  function onSubmit(data: TaskFormDialogType) {
    toast({
      title: "You submitted the following values:",
      description: "Sucess",
    });
  }

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
              memberModalRef={memberModalRef}
              placeholder="Search for members"
              className="rounded-none"
              members={task?.members}
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
