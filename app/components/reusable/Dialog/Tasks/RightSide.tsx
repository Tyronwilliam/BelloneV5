"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Ticket, Timer, User } from "lucide-react";
import { BiDuplicate } from "react-icons/bi";

import { DateInput } from "@/app/(fonctionnality)/project/Form/reusable/DateInput";
import { SelectableWithCreation } from "@/app/(fonctionnality)/project/Form/SelectableWithCreation";
import { addClient } from "@/service/Client/api";
import { toast } from "@/hooks/use-toast";
import { useSelectableWithCreation } from "@/hooks/useSelectableWithCreation";
import {
  ItemInterfaceType,
  StickersInterface,
  TaskFormDialogSchema,
  TaskFormDialogType,
} from "@/zodSchema/Project/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RightSide = ({ task }: { task: ItemInterfaceType }) => {
  const {
    isAddingNew,
    newData,
    handleChange,
    reset,
    toggleValue,
    isLoading,
    toggleIsLoading,
  } = useSelectableWithCreation();

  const form = useForm<z.infer<typeof TaskFormDialogSchema>>({
    resolver: zodResolver(TaskFormDialogSchema),
    defaultValues: {
      start_date: task?.start_date || "",
      completeAt: task?.completeAt || "",
      members: task?.members || [],
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
  function onSubmit(data: TaskFormDialogType) {
    toast({
      title: "You submitted the following values:",
      description: "Sucess",
    });
  }

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
            />
            <SelectableWithCreation
              control={form.control}
              name="members"
              label="Members"
              placeholder="Look for members"
              options={task?.members}
              isLoading={isLoading}
              addToDatabase={addClientToDatabase}
              isAddingNew={isAddingNew}
              newData={newData}
              handleChange={handleChange}
              toggleValue={toggleValue}
              inputPlaceholder="Add members via email"
              addButtonLabel="Add New Members"
              saveButtonLabel="Save Members"
              cancelButtonLabel="Cancel"
              isPopover={true}
              icon={<User />}
            />
            <DateInput
              control={form.control}
              name={"completeAt"}
              label={"Complete At"}
              isTasksDialog={true}
            />
          </form>{" "}
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
          </Button>{" "}
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
