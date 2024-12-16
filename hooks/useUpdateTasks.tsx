import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast, useToast } from "./use-toast";
import { createTaskMutation, updateTaskMutation } from "@/service/Task/query";

const useUpdateTasks = () => {
  const createTask = useMutation({
    mutationFn: async (variables: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PROTECTED_URL}/task`, // URL for your GraphQL endpoint
        {
          query: createTaskMutation, // Your GraphQL query
          variables: variables, // Variables passed to the query
        }
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
      toast({
        variant: "destructive",
        title: `Failed to update task: ${error.message}`,
      });

      throw new Error(error?.message);
    },
    onSuccess: (data) => {
      toast({
        variant: "default",
        title: "Task created successfully!",
      });
      return data;
    },
  });
  const updateTask = useMutation({
    mutationFn: async (variables: any) => {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_PROTECTED_URL}/task`, // URL for your GraphQL endpoint
        { query: updateTaskMutation, variables: variables }
      );
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
      toast({
        variant: "destructive",
        title: `Failed to update task: ${error.message}`,
      });

      throw new Error(error?.message);
    },
    onSuccess: (data) => {
      console.log("Task updated successfully:", data);
      toast({
        variant: "default",
        title: "Task updated successfully!",
      });
      return data;
    },
  });
  const handleCreateTask = async ({
    title,
    description,
    start_date,
    due_date,
    time,
    members,
    column_id,
    project_id,
    order,
  }: {
    title?: string;
    description?: string;
    start_date?: number;
    due_date?: number;
    time?: number;
    members?: string[];
    column_id?: string;
    project_id?: string;
    order?: number;
  }) => {
    try {
      // Use the mutateAsync method to wait for the result of the mutation
      const response = await createTask.mutateAsync({
        title,
        description,
        start_date,
        ...(due_date !== undefined && { due_date }),
        time,
        members,
        column_id,
        project_id,
        order,
      });

      console.log("Task created:", response); // Use the response here

      // Optionally, you can return the response or handle it further
      return response;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error; // If you want to propagate the error
    }
  };
  const handleUpdateTask = async ({
    id,
    title,
    description,
    start_date,
    due_date,
    time,
    members,
    column_id,
    project_id,
    order,
    pseudo_id,
  }: {
    id: string;
    title?: string;
    description?: string;
    start_date?: number;
    due_date?: number;
    time?: number;
    members?: string[];
    column_id?: string;
    project_id?: string;
    order?: number;
    pseudo_id?: string;
  }) => {
    return updateTask.mutateAsync({
      id,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(start_date !== undefined && { start_date }),
      ...(due_date !== undefined && { due_date }),
      ...(time !== undefined && { time }),
      ...(members !== undefined && { members }),
      ...(column_id !== undefined && { column_id }),
      ...(project_id !== undefined && { project_id }),
      ...(order !== undefined && { order }),
      ...(pseudo_id !== undefined && { pseudo_id }),
    });
  };

  return { handleUpdateTask, handleCreateTask };
};

export default useUpdateTasks;
