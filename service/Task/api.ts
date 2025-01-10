import { toast } from "@/hooks/use-toast";
import {
  CREATE_TASK_MUTATION,
  DELETE_TASK,
  UPDATE_TASK_MUTATION,
} from "@/service/Task/query";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { revalidateTag } from "next/cache";

type Member = {
  id: string;
  email: string;
};
export type TaskInput = {
  title?: string;
  description?: string;
  start_date?: Date | number;
  due_date?: Date;
  time?: number;
  members?: Member[];
  column_id?: string;
  project_id?: string;
  order?: number;
  id?: string;
  pseudo_id?: string;
};
export async function createTask(variables: TaskInput) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_PROTECTED_URL}/task`, {
      query: CREATE_TASK_MUTATION,
      variables: variables,
    })
    .then((response) => {
      if (response.data.errors) {
        throw new Error(
          response.data.errors.map((error: any) => error.message).join(", ")
        );
      }
      return response.data.data.createTask;
    })
    .catch((error) => {
      console.error("Erreur capturée dans updateTask:", error);
      throw error;
    });
}

export async function updateTask(variables: TaskInput) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_PROTECTED_URL}/task`, {
      query: UPDATE_TASK_MUTATION,
      variables: variables,
    })
    .then((response) => {
      if (response.data.errors) {
        throw new Error(
          response.data.errors.map((error: any) => error.message).join(", ")
        );
      }
      return response.data.data.updateTask;
    })
    .catch((error) => {
      console.error("Erreur capturée dans updateTask:", error);
      throw error;
    });
}
export async function deleteTask(variables: { id: string }) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_PROTECTED_URL}/task`, {
      query: DELETE_TASK,
      variables: variables,
    })
    .then((response) => {
      if (response.data.errors) {
        throw new Error(
          response.data.errors.map((error: any) => error.message).join(", ")
        );
      }
      return response.data.data.deleteTask;
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
      throw error;
    });
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
          return data;
        },
        ...options,
      });
    },
  },
  DeleteTask: {
    useMutation: (
      options?: UseMutationOptions<any, AxiosError, { id: string }>
    ) => {
      return useMutation<any, AxiosError, { id: string }>({
        mutationFn: (variables: { id: string }) => deleteTask(variables),
        onError: (error: AxiosError) => {
          console.error("Failed to delete task:", error);
          toast({
            variant: "destructive",
            title: `Failed to delete task: ${error.message}`,
          });
        },
        onSuccess: (data: any) => {
          toast({
            variant: "default",
            title: "Task deleted successfully!",
          });
          return data;
        },
        ...options,
      });
    },
  },
};
