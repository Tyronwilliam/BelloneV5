"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useSelectableWithCreation } from "@/hooks/useSelectableWithCreation";
import { ClientSchema } from "@/zodSchema/Client/zodSchema";
import { ProjectFormSchema, ProjectType } from "@/zodSchema/Project/project";
import { useState } from "react";
import CustomFormItem from "./reusable/CustomFormItem";
import { DateInput } from "./reusable/DateInput";
import { SelectInput } from "./reusable/SelectInput";
import { SelectableWithCreation } from "./SelectableWithCreation";
import z from "@/zodSchema/zod";

const statusOptions = [
  { value: "OPEN", label: "Open", color: "text-green-700" },
  { value: "IN_PROGRESS", label: "In progress", color: "text-orange-700" },
  { value: "CLOSE", label: "Close", color: "text-red-700" },
];

interface CreateProjectProps {
  clients: z.infer<typeof ClientSchema>[];
}
export function CreateProjectForm({ clients }: CreateProjectProps) {
  const [clientOptions, setClientOptions] = useState(clients);
  const transformClientsToOptions = clientOptions
    ? clientOptions.map((client: z.infer<typeof ClientSchema>) => ({
        value: client.id,
        label: client.email,
      }))
    : [];
  const form = useForm<ProjectType>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      clientId: null,
      budget: 0,
      startDate: new Date(),
      endDate: undefined, 
      status: "OPEN",
      progress: 0,
      creator: 1,
      time: 0, 
      image: undefined, 
    },
  });
  const {
    isAddingNew,
    newData,
    handleChange,
    reset,
    toggleValue,
    isLoading,
    toggleIsLoading,
  } = useSelectableWithCreation();

  const addClientToDatabase = async () => {
    // try {
    //   toggleIsLoading();
    // const response = await getClient();
    // const response = await addClient(newData);
    // if (response) {
    //   console.log(response, "Create new Client");
    //   toggleIsLoading();
    // setClientOptions((prevState) => [
    //   ...prevState,
    //   { id: response.id, name: newClient },
    // ]);
    // setNewClientName("");
    // setIsAddingNew(false);
    // alert("Client added successfully!");
    // }
    // } catch (error) {
    // toggleIsLoading();
    // console.error("Error saving client", error);
    // alert("Failed to add client.");
    // }
  };
  function onSubmit(data: ProjectType) {
    console.log("Form Submitted!", data); // Debugging
    toast({
      title: "You submitted the following values:",
      description: "Sucess",
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 flex flex-wrap items-start gap-4 mb-2"
      >
        <div className="flex-shrink-0 min-w-52 mt-6">
          <CustomFormItem
            control={form.control}
            name="title"
            label="Title"
            placeholder="Super App"
          />
        </div>
        <div className="flex-shrink-0 min-w-52 mt-0">
          <CustomFormItem
            control={form.control}
            name="description"
            label="Description"
            placeholder="Develop a mobile app for the super store."
          />
        </div>
        <div className="flex-shrink-0 min-w-52">
          <DateInput
            control={form.control}
            name="startDate"
            label="Start Date"
            isTasksDialog={false}
          />
        </div>
        <div className="flex-shrink-0 min-w-52">
          <DateInput
            control={form.control}
            name="endDate"
            label="End Date"
            isTasksDialog={false}
          />
        </div>{" "}
        <div className="flex-shrink-0 min-w-52">
          <SelectableWithCreation
            control={form.control}
            name="clientId"
            label="Client"
            placeholder="Select a client"
            options={transformClientsToOptions}
            isLoading={isLoading}
            addToDatabase={addClientToDatabase}
            isAddingNew={isAddingNew}
            newData={newData}
            handleChange={handleChange}
            toggleValue={toggleValue}
            inputPlaceholder="Add a client via email"
            addButtonLabel="Add New Client"
            saveButtonLabel="Save Client"
            cancelButtonLabel="Cancel"
            isPopover={false}
          />
        </div>
        <div className="flex-shrink-0 min-w-52">
          <CustomFormItem
            control={form.control}
            name="budget"
            label="Budget"
            placeholder="1500€"
            type="number"
            className="pl-9"
          />
        </div>
        <div className="flex-shrink-0 min-w-52">
          <SelectInput
            control={form.control}
            name="status"
            label="Status"
            placeholder="Select the status"
            options={statusOptions}
            key={"status"}
          />
        </div>
        <div className="basis-full flex items-center justify-center">
          <Button type="submit" className="text-base">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
