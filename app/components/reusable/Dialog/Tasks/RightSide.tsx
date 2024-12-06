"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Hourglass, Timer } from "lucide-react";
import { BiDuplicate } from "react-icons/bi";

import { DateInput } from "@/app/(fonctionnality)/project/Form/reusable/DateInput";
import {
  SelectableWithCreation
} from "@/app/(fonctionnality)/project/Form/SelectableWithCreation";
import { addClient } from "@/customApi/Client/api";
import { toast } from "@/hooks/use-toast";
import { ItemInterface, ItemInterfaceType } from "@/zodSchema/Project/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSelectableWithCreation } from "@/hooks/useSelectableWithCreation";

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

  const form = useForm<z.infer<typeof ItemInterface>>({
    resolver: zodResolver(ItemInterface),
    defaultValues: {
      start_date: task?.start_date || "",
      members: task?.members || [],
      completed_at: task?.completed_at || "",
      time: task?.time || 0,
    },
  });
  function onSubmit(data: ItemInterfaceType) {
    toast({
      title: "You submitted the following values:",
      description: "Sucess",
    });
  }

  //FAIRE FONCTION DISTINCTE POUR CHAQUE ETAPE POUR EVITER LE SOUCIS DES STATES
  const addClientToDatabase = async () => {
    try {
      toggleIsLoading();
      // const response = await getClient();
      const response = await addClient(newData);
      if (response) {
        console.log(response, "Create new Client");
        toggleIsLoading();
        // setClientOptions((prevState) => [
        //   ...prevState,
        //   { id: response.id, name: newClient },
        // ]);
        // setNewClientName("");
        // setIsAddingNew(false);
        // alert("Client added successfully!");
      }
    } catch (error) {
      toggleIsLoading();
      console.error("Error saving client", error);
      alert("Failed to add client.");
    }
  };

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
            />

            <Button
              variant="outline"
              className="w-full text-wrap flex justify-start "
            >
              <Hourglass /> Complete At
            </Button>
            <Button
              variant="outline"
              className="w-full text-wrap flex justify-start "
            >
              <Timer /> Timer
            </Button>
          </form>
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
