import { TaskInput } from "@/service/Task/api";
import { CollaboratorType } from "@/zodSchema/Collaborators/collabo";
import { TaskInterfaceType } from "@/zodSchema/Project/tasks";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useMemo,
    useRef,
} from "react";
import { useToggle } from "./useToggle";

interface UseMembersProps {
  filteredCollaborators: CollaboratorType[];
  addMember: (id: string, email: string) => void;
  removeMember: (id: string) => void;
  openMembers: boolean;
  toggleMembers: () => void;
  handleCloseMembersModal: () => void;
  memberModalRef: MutableRefObject<null>;
}

export const useMembers = (
  task: TaskInterfaceType,
  collaboByCreator: CollaboratorType[] | undefined,
  member: any,
  updateTaskMutation: UseMutateAsyncFunction<
    any,
    AxiosError<unknown, any>,
    TaskInput,
    unknown
  >,
  currentTask: TaskInterfaceType,
  setCurrentTask: Dispatch<SetStateAction<TaskInterfaceType>>,
  resetForm: (arg: string, value: any | undefined) => void
): UseMembersProps => {
  const { value: openMembers, toggleValue: toggleMembers } = useToggle();
  const memberModalRef = useRef(null);

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

  return {
    filteredCollaborators,
    addMember,
    removeMember,
    openMembers,
    toggleMembers,
    handleCloseMembersModal,
    memberModalRef,
  };
};
