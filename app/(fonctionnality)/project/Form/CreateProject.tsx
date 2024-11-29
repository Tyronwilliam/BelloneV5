"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import CustomFormItem from "./reusable/CustomFormItem";
import { DateInput } from "./reusable/DateInput";
import { SelectInput } from "./reusable/SelectInput";
import { ClientForm } from "./ClientForm";
import { useState } from "react";
import { addClient, getClient } from "@/customApi/Client/api";
import { ClientSchema } from "@/zodSchema/Client/zodSchema";
import { useToggle } from "@/hooks/useToggle";
import { ProjectType, ProjectTypeSchema } from "@/zodSchema/Project/project";

const statusOptions = [
  { value: "OPEN", label: "Open", color: "text-green-700" },
  { value: "IN_PROGRESS", label: "In progress", color: "text-orange-700" },
  { value: "CLOSE", label: "Close", color: "text-red-700" },
];

interface CreateProjectProps {
  clients: z.infer<typeof ClientSchema>[];
}
export function CreateProjectForm({ clients }: CreateProjectProps) {
  const { toast } = useToast();
  const { value, toggleValue } = useToggle();
  const [clientOptions, setClientOptions] = useState(clients);
  const [selectedClient, setSelectedClient] = useState<string | undefined>("");
  const [newClientEmail, setNewClientEmail] = useState<string>("");

  // Get client from server
  // const [clients, setClients] = useState([
  //   // { id: "1", name: "John Doe" },
  //   // { id: "2", name: "Jane Smith" },
  // ]);
  // Add client to the database and update local state
  const addClientToDatabase = async () => {
    try {
      // const response = await getClient();
      const response = await addClient(newClientEmail);
      if (response) {
        console.log(response, "Create new Client");
        // setClientOptions((prevState) => [
        //   ...prevState,
        //   { id: response.id, name: newClient },
        // ]);
        // setNewClientName("");
        // setIsAddingNew(false);
        // alert("Client added successfully!");
      }
    } catch (error) {
      console.error("Error saving client", error);
      alert("Failed to add client.");
    }
  };
  //   // Handle new client name change
  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClientEmail(e.target.value);
  };
  const form = useForm<ProjectType>({
    resolver: zodResolver(ProjectTypeSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      status: "OPEN",
      budget: 0,
      clientId: null,
    },
  });

  function onSubmit(data: ProjectType) {
    toast({
      title: "You submitted the following values:",
      description: "Sucess",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <CustomFormItem
          control={form.control}
          name="title"
          label="Title"
          placeholder="Super App"
        />
        <CustomFormItem
          control={form.control}
          name="description"
          label="Description"
          placeholder="Develop a mobile app for the super store."
        />
        <ClientForm
          control={form.control}
          name="clientId"
          label="Client"
          placeholder="Select a client"
          options={clientOptions}
          addClientToDatabase={addClientToDatabase}
          newClientEmail={newClientEmail}
          handleNewClientChange={handleNewClientChange}
          isAddingNew={value}
          toggleValue={toggleValue}
        />
        <DateInput
          control={form.control}
          name="startDate"
          label="Start Date"
          isTasksDialog={false}
        />
        <DateInput
          control={form.control}
          name="endDate"
          label="End Date"
          isTasksDialog={false}
        />
        <CustomFormItem
          control={form.control}
          name="budget"
          label="Budget"
          placeholder="1500€"
          type="number"
          className="pl-9"
        />
        <SelectInput
          control={form.control}
          name="status"
          label="Status"
          placeholder="Select the status"
          options={statusOptions}
          key={"status"}
        />
        <Button type="submit" className="block mx-auto">
          Submit
        </Button>
      </form>
    </Form>
  );
}
