import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./use-toast";
import { updateTaskMutation } from "@/service/Task/query";

const useUpdateTasks = () => {
  const { toast } = useToast();

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

  const handleUpdateTask = ({
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
    return updateTask.mutate({
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

  return { handleUpdateTask };
};

export default useUpdateTasks;
