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
import { customFormatDate } from "@/utils/date";
import { CollaboratorType } from "@/zodSchema/Collaborators/collabo";
import {
  TaskFormDialogSchema,
  TaskFormDialogType,
  TaskInterfaceType,
} from "@/zodSchema/Project/tasks";
import z from "@/zodSchema/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import MembersModal from "./RightSIdeItem/MembersModal";
import { TaskDialogInterface } from "./TaskDialog";
import { TaskInput } from "@/service/Task/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { revalidateTag } from "next/cache";
import { getColumnsWithTasks } from "@/service/Task/uncommon";
import { DNDType } from "../../Kanban/KanbanView";

const RightSide = ({
  task,
  setContainers,
}: {
  task: TaskInterfaceType;
  setContainers?: Dispatch<SetStateAction<[] | DNDType[]>>;
}) => {
  const pathname = usePathname();
  const projectId = pathname.split("/project/")[1];

  console.log(projectId, "HELLO ");
  const creatorId = "6763f8583ddd86e73e00a11b";
  const { data: collaboByCreator } =
    ApiRequest.Collabo.GetCollaboByCreatorId.useQuery(creatorId);
  const { mutateAsync: updateTaskMutation } =
    ApiRequest.Task.UpdateTask.useMutation();
  const {
    mutateAsync: createTaskMutation,
    isPending: createTaskPending,
    isSuccess: createTaskSuccess,
    isError: createTaskError,
  } = ApiRequest.Task.CreateTask.useMutation();
  const { value: openMembers, toggleValue: toggleMembers } = useToggle();
  const memberModalRef = useRef<HTMLDivElement | null>(null);
  const [currentTask, setCurrentTask] = useState<TaskInterfaceType>(task);
  const form = useForm<z.infer<typeof TaskFormDialogSchema>>({
    resolver: zodResolver(TaskFormDialogSchema),
    defaultValues: {
      start_date: task?.start_date ? new Date(task?.start_date) : undefined,
      completeAt: task?.completeAt ? new Date(task?.completeAt) : undefined,
      due_date: task?.due_date ? new Date(task?.due_date) : undefined,
      member: "",
      time: task?.time || 0,
    },
  });
  const { watch } = form;
  const member = watch("member");
  const resetForm = (arg: string, value: any | undefined) => {
    form.reset(
      {
        ...form.getValues(),
        [arg]: value ? value : "",
      },
      {
        keepDirty: true,
      }
    );
  };
  const removeMember = async (id: string) => {
    if (!id) return;
    const updatedMembers = currentTask?.members?.filter(
      (item) => item.id !== id
    );
    try {
      const res = await updateTaskMutation({
        id: task?.id,
        members: updatedMembers,
      });
      setCurrentTask((prev) => ({ ...prev, members: updatedMembers }));
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };
  const addMember = async (id: string, email: string) => {
    const newMember = { id, email };
    const updatedMembers = [...(currentTask?.members || []), newMember];
    try {
      const res = await updateTaskMutation({
        id: task?.id,
        members: updatedMembers,
      });
      setCurrentTask((prev) => ({ ...prev, members: updatedMembers }));
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };
  const handleCloseMembersModal = () => {
    resetForm("member", undefined);
    toggleMembers();
  };
  const changeDate = async (date: Date, arg: string) => {
    const timestamp: number = date?.getTime();
    try {
      await updateTaskMutation({
        id: task?.id,
        [arg]: timestamp,
      });
      resetForm(arg, date);
    } catch (error) {
      console.error("Error update date:", error);
    }
  };
  const duplicateTask = async () => {
    try {
      const duplicatedTaskData = {
        ...task,
        id: undefined,
        title: `${task.title} (Copy)`,
        column_id: task?.column_id!,
      };
      const newTask = await createTaskMutation(duplicatedTaskData);
      const columnsWithTasks = await getColumnsWithTasks(projectId);
      setContainers && setContainers(columnsWithTasks);
    } catch (error) {
      console.error("Error duplicating task:", error);
    }
  };

  // const stickerForm = useForm<z.infer<typeof StickerFormInterface>>({
  //   resolver: zodResolver(StickerFormInterface),
  //   defaultValues: {
  //     hexcode: "",
  //     title: "",
  //     taskId: [],
  //   },
  // });
  const filteredCollaborators: CollaboratorType[] = useMemo(() => {
    if (member) {
      const existingMemberIds = new Set(currentTask?.members?.map((m) => m.id));

      return (
        collaboByCreator?.filter(
          (collabo: CollaboratorType) =>
            !existingMemberIds.has(collabo.userId) &&
            collabo?.email
              ?.trim()
              .toLowerCase()
              .includes(member.trim().toLowerCase())
        ) || []
      );
    }
    return [];
  }, [member, collaboByCreator, currentTask?.members]);

  function onSubmit(data: TaskFormDialogType) {
    toast({
      title: "You submitted the following values:",
      description: "Sucess",
    });
  }

  useClickOutside(memberModalRef, () => handleCloseMembersModal(), openMembers);

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
              label={"Start Date"}
              isTasksDialog={true}
              changeDate={changeDate}
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
              removeMember={removeMember}
              addMember={addMember}
              membersAssigned={currentTask?.members}
            />
            <DateInput
              control={form.control}
              name={"due_date"}
              label={"Due date"}
              isTasksDialog={true}
              changeDate={changeDate}
            />
            <DateInput
              control={form.control}
              name={"completeAt"}
              label={"Complete At"}
              isTasksDialog={true}
              changeDate={changeDate}
            />{" "}
            {/* <Button
              variant="outline"
              className="w-full text-wrap flex justify-start "
            >
              <Timer /> Timer
            </Button> */}
            <Button
              variant="outline"
              className="w-full text-wrap flex justify-start "
              onClick={duplicateTask}
              type="button"
            >
              <BiDuplicate /> Dupliquer
            </Button>
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
        </Form>
      </section>
    </section>
  );
};

export default RightSide;
