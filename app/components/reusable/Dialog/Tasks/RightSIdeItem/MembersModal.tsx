"use client";
import { Button } from "@/components/ui/button";
import { User, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { FieldValues } from "react-hook-form"; // Ensure you import FieldValues
import { FormFieldComponentProps } from "@/app/(fonctionnality)/project/Form/reusable/FormCustom";
import CustomFormItem from "@/app/(fonctionnality)/project/Form/reusable/CustomFormItem";

type MembersModalProps<T extends FieldValues> = FormFieldComponentProps<T> & {
  toggleMembers: () => void;
  openMembers: boolean;
  inputMemberRef: React.RefObject<HTMLDivElement>;
  members: any[];
  handleGetCollaboratorByProjectId: ({
    projectId,
  }: {
    projectId: string;
  }) => Promise<any>;
  projectId: string;
};

const MembersModal = <T extends FieldValues>({
  toggleMembers,
  openMembers,
  inputMemberRef,
  control,
  name,
  label,
  placeholder,
  className,
  members,
  handleGetCollaboratorByProjectId,
  projectId,
}: MembersModalProps<T>) => {
  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        className="w-full text-wrap flex justify-start "
        onClick={async () => {
          toggleMembers();
          const res = await handleGetCollaboratorByProjectId({ projectId });
          console.log(res);
        }}
        type="button"
      >
        <User /> Members
      </Button>
      {openMembers && (
        <Card
          ref={inputMemberRef}
          className="absolute top-[130%] left-0 w-[304px] p-4 h-[176px] flex flex-col gap-2"
        >
          <div className="flex items-center relative">
            <span className="mx-auto">Members</span>
            <X
              className="w-4 h-4 ml-auto absolute right-0 cursor-pointer"
              onClick={toggleMembers}
            />
          </div>
          <CustomFormItem
            placeholder={placeholder}
            className={className}
            control={control}
            name={name}
            label={label}
          />
          <p className=" text-gray-700 font-normal text-xs">
            Members of the Kanban
          </p>
          <div className="flex items-center justify-between w-full h-12 bg-black bg-opacity-0 hover:bg-opacity-5 cursor-pointer rounded-sm px-2">
            {members?.length > 0 &&
              members?.map((member, index) => (
                <p
                  className="truncate w-[90%] overflow-hidden text-ellipsis"
                  key={index}
                >
                  {member}
                  {/* tyronwilliamchandfsdfsdfsdfdsffdsfdfsdfu@gmail.com */}
                </p>
              ))}

            <X className="w-4 h-4 flex-shrink-0-" />
          </div>
        </Card>
      )}
    </div>
  );
};

export default MembersModal;
