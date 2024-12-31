"use client";
import { Button } from "@/components/ui/button";
import { User, X } from "lucide-react";

import { Card } from "@/components/ui/card";

import CustomFormItem from "@/app/(fonctionnality)/project/Form/reusable/CustomFormItem";
import { FormFieldComponentProps } from "@/app/(fonctionnality)/project/Form/reusable/FormCustom";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form"; // Ensure you import FieldValues
import { CollaboratorType } from "@/zodSchema/Collaborators/collabo";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TaskInput } from "@/service/Task/api";
import { TaskInterfaceType } from "@/zodSchema/Project/tasks";
type MembersModalProps<T extends FieldValues> = FormFieldComponentProps<T> & {
  toggleMembers: () => void;
  openMembers: boolean;
  memberModalRef: React.RefObject<HTMLDivElement>;
  memberState: string;
  collaborators: [];
  setFilteredCollaborators: (collaborators: CollaboratorType[]) => void; // Fonction pour filtrer les collaborateurs
  filteredCollaborators: CollaboratorType[];
  projectId: string;
  removeMember: UseMutateAsyncFunction<
    any,
    AxiosError<unknown, any>,
    TaskInput,
    unknown
  >;
  taskId: string;
  membersAssigned: TaskInterfaceType["members"];
};

const MembersModal = <T extends FieldValues>({
  toggleMembers,
  openMembers,
  memberModalRef,
  control,
  name,
  label,
  placeholder,
  className,
  memberState,
  collaborators,
  setFilteredCollaborators,
  filteredCollaborators,
  projectId,
  removeMember,
  taskId,
  membersAssigned,
}: MembersModalProps<T>) => {
  useEffect(() => {
    if (memberState) {
      const filtered = collaborators?.filter((collabo: CollaboratorType) =>
        collabo?.email
          ?.trim()
          .toLowerCase()
          .includes(memberState.trim().toLowerCase())
      );
      setFilteredCollaborators(filtered || []);
    } else {
      setFilteredCollaborators([]);
    }
  }, [memberState, collaborators]);
  return (
    <div className="relative w-full " ref={memberModalRef}>
      <Button
        variant="outline"
        className="w-full text-wrap flex justify-start "
        onClick={() => {
          if (!openMembers) {
            toggleMembers();
          } else {
            return;
          }
        }}
        type="button"
      >
        <User /> Members
      </Button>
      {openMembers && (
        <Card className="absolute top-[130%] left-0 w-[304px] p-4 h-fit flex flex-col gap-2">
          <div className="flex items-center relative">
            <span className="mx-auto">Members</span>
            <X
              className="w-4 h-4 ml-auto absolute right-0 cursor-pointer"
              onClick={toggleMembers}
            />
          </div>
          <div>
            <CustomFormItem
              placeholder={placeholder}
              className={className}
              control={control}
              name={name}
              label={label}
            />
            {filteredCollaborators?.map((item, index) => {
              return (
                item.email && (
                  <div
                    key={index}
                    className="flex items-center justify-between w-full h-12 mt-2 bg-black bg-opacity-0 hover:bg-opacity-5 cursor-pointer rounded-sm px-2"
                  >
                    {item.email}
                  </div>
                )
              );
            })}
          </div>
          <p className=" text-gray-700 font-normal text-xs">
            Members of the Kanban
          </p>
          {membersAssigned?.length > 0 &&
            membersAssigned?.map(
              (member: { email: string; id: string }) =>
                member?.email && (
                  <div
                    key={member?.id}
                    className="flex items-center justify-between w-full h-12 bg-black bg-opacity-0 hover:bg-opacity-5 cursor-pointer rounded-sm px-2"
                  >
                    <p className="truncate w-[90%] overflow-hidden text-ellipsis">
                      {member?.email}
                    </p>
                    <X
                      className="w-4 h-4 flex-shrink-0-"
                      onClick={() =>
                        removeMember({ id: taskId, project_id: projectId })
                      }
                    />
                  </div>
                )
            )}
        </Card>
      )}
    </div>
  );
};

export default MembersModal;
