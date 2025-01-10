"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Trash } from "lucide-react";
import { BiDuplicate } from "react-icons/bi";

import { DateInput } from "@/app/(fonctionnality)/project/Form/reusable/DateInput";
import { toast } from "@/hooks/use-toast";
import useClickOutside from "@/hooks/useClickOutside";
import { useMembers } from "@/hooks/useMembers";
import { useTask } from "@/hooks/useTask";
import ApiRequest from "@/service";
import {
  TaskFormDialogSchema,
  TaskFormDialogType,
  TaskInterfaceType,
} from "@/zodSchema/Project/tasks";
import z from "@/zodSchema/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { DNDType } from "../../Kanban/KanbanView";
import MembersModal from "./RightSIdeItem/MembersModal";

interface RightSideProps {
  task: TaskInterfaceType;
  setContainers: Dispatch<SetStateAction<[] | DNDType[]>>;
  close: () => void;
  projectId: string;
}

const RightSide: React.FC<RightSideProps> = ({
  task,
  setContainers,
  close,
  projectId,
}: RightSideProps) => {
  const pathname = usePathname();
  const creatorId = "6763f8583ddd86e73e00a11b";
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
  const { watch } = form;
  const member = watch("member");

  const { data: collaboByCreator } =
    ApiRequest.Collabo.GetCollaboByCreatorId.useQuery(creatorId);

  const {
    updateTask,
    deleteTask,
    createTask,
    changeDate,
    currentTask,
    setCurrentTask,
  } = useTask(task, task.id, setContainers, projectId, close, resetForm);

  const {
    filteredCollaborators,
    addMember,
    removeMember,
    toggleMembers,
    openMembers,
    handleCloseMembersModal,
    memberModalRef,
  } = useMembers(
    task,
    collaboByCreator,
    member,
    updateTask,
    currentTask,
    setCurrentTask,
    resetForm
  );

  useClickOutside(memberModalRef, handleCloseMembersModal, openMembers);

  const onSubmit = (data: TaskFormDialogType) => {
    toast({
      title: "Task updated",
      description: "Successfully submitted task values.",
    });
  };

  return (
    <section className="w-1/4 h-full p-2">
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
            />
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
              label={"Complete at"}
              isTasksDialog={true}
              changeDate={changeDate}
            />
            <Button
              variant="outline"
              className="w-full flex justify-start"
              onClick={createTask}
            >
              <BiDuplicate /> Dupliquer
            </Button>
            <Button
              variant="destructive"
              className="w-full flex justify-start"
              onClick={deleteTask}
            >
              <Trash /> Delete
            </Button>
          </form>
        </Form>
      </section>
    </section>
  );
};

export default RightSide;
