import { toast } from "@/hooks/use-toast";
import {
  CREATE_TASK_MUTATION,
  UPDATE_TASK_MUTATION,
} from "@/service/Task/query";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type Member = {
  id: string;
  email: string;
};
export type TaskInput = {
  title?: string;
  description?: string;
  start_date?: number;
  due_date?: number;
  time?: number;
  members?: Member[];
  column_id?: string;
  project_id?: string;
  order?: number;
  id?: string; // For updates only
  pseudo_id?: string; // For updates only
};
export async function createTask(variables: TaskInput) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_PROTECTED_URL}/task`,
    {
      query: CREATE_TASK_MUTATION,
      variables: variables,
    }
  );
  console.log(response, "FROM 1 LEVEL ");
  return response.data.data.createTask;
}

export async function updateTask(variables: TaskInput) {
  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_PROTECTED_URL}/task`, {
      query: UPDATE_TASK_MUTATION,
      variables: variables,
    })
    .then((res) => res)
    .catch((err) => err);
  return response.data.updateTask;;
}

export const Task = {
  CreateTask: {
    useMutation: (options?: UseMutationOptions<any, AxiosError, TaskInput>) => {
      return useMutation({
        mutationFn: (variables: TaskInput) => createTask(variables),
        onError: (error) => {
          console.error("Failed to create task:", error);
          toast({
            variant: "destructive",
            title: `Failed to create task: ${error.message}`,
          });
        },
        onSuccess: (data) => {
          toast({
            variant: "default",
            title: "Task created successfully!",
          });
          return data;
        },
        ...options,
      });
    },
  },

  UpdateTask: {
    useMutation: (options?: UseMutationOptions<any, AxiosError, TaskInput>) => {
      return useMutation<any, AxiosError, TaskInput>({
        mutationFn: (variables: TaskInput) => updateTask(variables),
        onError: (error: AxiosError) => {
          console.error("Failed to update task:", error);
          toast({
            variant: "destructive",
            title: `Failed to update task: ${error.message}`,
          });
        },
        onSuccess: (data: any) => {
          toast({
            variant: "default",
            title: "Task updated successfully!",
          });
          console.log(data, ": DATA TASK LEVEL 2 TASK UPDATE");
          return data
        },
        ...options,
      });
    },
  },
};
