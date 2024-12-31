import { toast } from "@/hooks/use-toast";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  CREATE_COLUMN_MUTATION,
  GET_COLUMNS_BY_PROJECT_ID,
  UPDATE_COLUMN_MUTATION,
} from "./query";

interface Column {
  id: string; // Required field of type string
  title?: string; // Optional field of type string
  color?: string; // Optional field of type string
  project_id?: string; // Optional field of type string
  order?: number; // Optional field of type number
}
type CreateColumnType = Omit<Column, "id">;

async function getColumnsByProjectId(projectId: string) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_PROTECTED_URL}/columns`,
    { query: GET_COLUMNS_BY_PROJECT_ID, projectId }
  );
  return response?.data?.columnsByProjectId;
}

async function updateColumn(variables: Column) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_PROTECTED_URL}/columns`,
    { query: UPDATE_COLUMN_MUTATION, variables }
  );
  return response?.data?.updateColumn;
}

async function createColumn(variables: CreateColumnType) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_PROTECTED_URL}/columns`,
    { query: CREATE_COLUMN_MUTATION, variables }
  );
  return response?.data?.data?.addColumn;
}

export const Columns = {
  GetColumnsByProjectId: {
    useQuery: (
      projectId: string,
      options?: UseQueryOptions<any, AxiosError>
    ) => {
      return useQuery({
        queryKey: ["columns", projectId],
        queryFn: () => getColumnsByProjectId(projectId),
        enabled: !!projectId,
        ...options,
      });
    },
  },
  UpdateColumn: {
    useMutation: (options?: UseMutationOptions<any, AxiosError, Column>) => {
      return useMutation<any, AxiosError, any>({
        mutationFn: (variables: Column) => updateColumn(variables),
        onError: (error: AxiosError) => {
          console.error("Failed to update column:", error);
          toast({
            variant: "destructive",
            title: `Failed to update column: ${error.message}`,
          });
        },
        onSuccess: (data: any) => {
          toast({
            variant: "default",
            title: "Column updated successfully!",
          });
          return data;
        },
        ...options,
      });
    },
  },
  CreateColumn: {
    useMutation: (
      options?: UseMutationOptions<any, AxiosError, CreateColumnType>
    ) => {
      return useMutation<any, AxiosError, CreateColumnType>({
        mutationFn: (variables: CreateColumnType) => createColumn(variables),
        onError: (error: AxiosError) => {
          console.error("Failed to create column:", error);
          toast({
            variant: "destructive",
            title: `Failed to create column: ${error.message}`,
          });
        },
        onSuccess: (data: any) => {
          toast({
            variant: "default",
            title: "Column created successfully!",
          });
          return data;
        },
        ...options,
      });
    },
  },
};
