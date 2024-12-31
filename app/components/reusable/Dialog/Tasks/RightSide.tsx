"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Timer } from "lucide-react";
import { BiDuplicate } from "react-icons/bi";

import { DateInput } from "@/app/(fonctionnality)/project/Form/reusable/DateInput";
import { toast } from "@/hooks/use-toast";
import useClickOutside from "@/hooks/useClickOutside";
import { useToggle } from "@/hooks/useToggle";
import ApiRequest from "@/service";
import {
  StickerFormInterface,
  TaskFormDialogSchema,
  TaskFormDialogType,
  TaskInterfaceType,
} from "@/zodSchema/Project/tasks";
import z from "@/zodSchema/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import MembersModal from "./RightSIdeItem/MembersModal";
import { CollaboratorType } from "@/zodSchema/Collaborators/collabo";

const RightSide = ({ task }: { task: TaskInterfaceType }) => {
  const projectId = "676d3c3ed610fd3d18462e24";
  const creatorId = "6763f8583ddd86e73e00a11b";
  const {
    data: collaboByCreator,
    error,
    isLoading,
    refetch,
  } = ApiRequest.Collabo.GetCollaboByCreatorId.useQuery(creatorId);
  const { mutateAsync: updateTaskMutation } =
    ApiRequest.Task.UpdateTask.useMutation();
  const { value: openMembers, toggleValue: toggleMembers } = useToggle();
  const memberModalRef = useRef<HTMLDivElement | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  useClickOutside(memberModalRef, () => toggleMembers(), openMembers);

  const form = useForm<z.infer<typeof TaskFormDialogSchema>>({
    resolver: zodResolver(TaskFormDialogSchema),
    defaultValues: {
      start_date: task?.start_date || "",
      completeAt: task?.completeAt || "",
      member: "",
      time: task?.time || 0,
    },
  });
  const { watch } = form;
  const member = watch("member");
  const [filteredCollaborators, setFilteredCollaborators] = useState<
    CollaboratorType[]
  >([]);
  const handleRemoveMember = async () => {
    if (selectedMember === null) return;
    console.log(selectedMember, "MEMBER");
    const filterMember = task?.members?.filter(
      (item) => item?.id !== selectedMember
    );

    console.log(filterMember, "filterMember");
    const res = await updateTaskMutation({
      id: task?.id,
      members: filterMember,
    });
    await refetch();
    console.log(res);
  };
  const stickerForm = useForm<z.infer<typeof StickerFormInterface>>({
    resolver: zodResolver(StickerFormInterface),
    defaultValues: {
      hexcode: "",
      title: "",
      taskId: [],
    },
  });
  useEffect(() => {
    if (member) {
      const filtered = collaboByCreator?.filter((collabo: CollaboratorType) =>
        collabo?.email
          ?.trim()
          .toLowerCase()
          .includes(member.trim().toLowerCase())
      );
      setFilteredCollaborators(filtered || []);
    } else {
      setFilteredCollaborators([]);
    }
  }, [member]);

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
              name={"member"}
              toggleMembers={toggleMembers}
              openMembers={openMembers}
              memberModalRef={memberModalRef}
              placeholder="Search for members"
              className="rounded-none"
              filteredCollaborators={filteredCollaborators}
              removeMember={handleRemoveMember}
              membersAssigned={task?.members}
              setSelectedMember={setSelectedMember}
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
