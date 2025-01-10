// "use client";
// import { Button } from "@/components/ui/button";
// import { User, X } from "lucide-react";

// import { Card } from "@/components/ui/card";

// import CustomFormItem from "@/app/(fonctionnality)/project/Form/reusable/CustomFormItem";
// import { FormFieldComponentProps } from "@/app/(fonctionnality)/project/Form/reusable/FormCustom";
// import { CollaboratorType } from "@/zodSchema/Collaborators/collabo";
// import { TaskInterfaceType } from "@/zodSchema/Project/tasks";
// import { useEffect } from "react";
// import { FieldValues } from "react-hook-form";
// type MembersModalProps<T extends FieldValues> = FormFieldComponentProps<T> & {
//   toggleMembers: () => void;
//   openMembers: boolean;
//   memberModalRef: React.RefObject<HTMLDivElement>;
//   filteredCollaborators: CollaboratorType[];
//   removeMember: (memberId: string) => void;
//   addMember: (id: string, email: string) => void;
//   membersAssigned: TaskInterfaceType["members"];
// };

// const MembersModal = <T extends FieldValues>({
//   toggleMembers,
//   openMembers,
//   memberModalRef,
//   control,
//   name,
//   label,
//   placeholder,
//   className,
//   filteredCollaborators,
//   removeMember,
//   addMember,
//   membersAssigned,
// }: MembersModalProps<T>) => {
//   return (
//     <div className="relative w-full " ref={memberModalRef}>
//       <Button
//         variant="outline"
//         className="w-full text-wrap flex justify-start "
//         onClick={() => {
//           if (!openMembers) {
//             toggleMembers();
//           } else {
//             return;
//           }
//         }}
//         type="button"
//       >
//         <User /> Members
//       </Button>
//       {openMembers && (
//         <Card className="absolute top-[130%] left-0 w-[304px] p-4 h-fit flex flex-col gap-2">
//           <div className="flex items-center relative">
//             <span className="mx-auto">Members</span>
//             <X
//               className="w-4 h-4 ml-auto absolute right-0 cursor-pointer"
//               onClick={toggleMembers}
//             />
//           </div>
//           <div>
//             <CustomFormItem
//               placeholder={placeholder}
//               className={className}
//               control={control}
//               name={name}
//               label={label}
//             />
//             {filteredCollaborators?.map((item, index) => {
//               return (
//                 item?.email && (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between w-full h-12 mt-2 bg-black bg-opacity-0 hover:bg-opacity-5 cursor-pointer rounded-sm px-2"
//                     onClick={() => addMember(item.userId, item?.email!)}
//                   >
//                     {item.email}
//                   </div>
//                 )
//               );
//             })}
//           </div>
//           <p className=" text-gray-700 font-normal text-xs">
//             Members of the Kanban
//           </p>
//           {membersAssigned?.length > 0 &&
//             membersAssigned?.map(
//               (member: { email: string; id: string }) =>
//                 member?.email && (
//                   <div
//                     key={member?.id}
//                     className="flex items-center justify-between w-full h-12 bg-black bg-opacity-0 hover:bg-opacity-5 cursor-pointer rounded-sm px-2"
//                     onClick={() => removeMember(member?.id)}
//                   >
//                     <p className="truncate w-[90%] overflow-hidden text-ellipsis">
//                       {member?.email}
//                     </p>
//                     <X className="w-4 h-4 flex-shrink-0-" />
//                   </div>
//                 )
//             )}
//         </Card>
//       )}
//     </div>
//   );
// };

// export default MembersModal;
"use client";

import { Button } from "@/components/ui/button";
import { User, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import CustomFormItem from "@/app/(fonctionnality)/project/Form/reusable/CustomFormItem";
import { FormFieldComponentProps } from "@/app/(fonctionnality)/project/Form/reusable/FormCustom";
import { CollaboratorType } from "@/zodSchema/Collaborators/collabo";
import { TaskInterfaceType } from "@/zodSchema/Project/tasks";
import { useEffect } from "react";
import { FieldValues } from "react-hook-form";

interface MembersModalProps<T extends FieldValues>
  extends FormFieldComponentProps<T> {
  toggleMembers: () => void;
  openMembers: boolean;
  memberModalRef: React.RefObject<HTMLDivElement>;
  filteredCollaborators: CollaboratorType[];
  removeMember: (memberId: string) => void;
  addMember: (id: string, email: string) => void;
  membersAssigned: TaskInterfaceType["members"];
}

const MembersModal = <T extends FieldValues>({
  toggleMembers,
  openMembers,
  memberModalRef,
  control,
  name,
  label,
  placeholder,
  className,
  filteredCollaborators,
  removeMember,
  addMember,
  membersAssigned,
}: MembersModalProps<T>) => {
  return (
    <div className="relative w-full" ref={memberModalRef}>
      <Triggering toggleMembers={toggleMembers} />
      {openMembers && (
        <Card className="absolute top-[130%] left-0 w-[304px] p-4 h-fit flex flex-col gap-2">
          {/* Modal Header */}
          <div className="flex items-center relative">
            <span className="mx-auto">Members</span>
            <X
              className="w-4 h-4 ml-auto absolute right-0 cursor-pointer"
              onClick={toggleMembers}
            />
          </div>

          {/* Search/filter input */}
          <CustomFormItem
            placeholder={placeholder}
            className={className}
            control={control}
            name={name}
            label={label}
          />
          <SearchListMembers
            filteredCollaborators={filteredCollaborators}
            addMember={addMember}
          />
          <CurrentMembers
            membersAssigned={membersAssigned}
            removeMember={removeMember}
          />
        </Card>
      )}
    </div>
  );
};

export default MembersModal;

const Triggering = ({ toggleMembers }: { toggleMembers: () => void }) => {
  return (
    <Button
      variant="outline"
      className="w-full text-wrap flex justify-start"
      onClick={() => toggleMembers()}
      type="button"
    >
      <User /> Members
    </Button>
  );
};
const SearchListMembers = ({
  filteredCollaborators,
  addMember,
}: {
  filteredCollaborators: CollaboratorType[];
  addMember: (id: string, email: string) => void;
}) => {
  return (
    <div>
      {filteredCollaborators?.map(
        (item) =>
          item?.email !== undefined &&
          item?.email && (
            <div
              key={item.userId}
              className="flex items-center justify-between w-full h-12 mt-2 bg-black bg-opacity-0 hover:bg-opacity-5 cursor-pointer rounded-sm px-2"
              onClick={() => addMember(item.userId, item.email!)}
            >
              {item.email}
            </div>
          )
      )}
    </div>
  );
};
const CurrentMembers = ({
  membersAssigned,
  removeMember,
}: {
  membersAssigned: TaskInterfaceType["members"];
  removeMember: (memberId: string) => void;
}) => {
  return (
    <>
      <p className="text-gray-700 font-normal text-xs mt-2">
        Members of the Kanban
      </p>
      {membersAssigned?.length > 0 &&
        membersAssigned.map(
          (member) =>
            member?.email && (
              <div
                key={member.id}
                className="flex items-center justify-between w-full h-12 bg-black bg-opacity-0 hover:bg-opacity-5 cursor-pointer rounded-sm px-2"
                onClick={() => removeMember(member.id)}
              >
                <p className="truncate w-[90%] overflow-hidden text-ellipsis">
                  {member.email}
                </p>
                <X className="w-4 h-4 flex-shrink-0" />
              </div>
            )
        )}
    </>
  );
};
