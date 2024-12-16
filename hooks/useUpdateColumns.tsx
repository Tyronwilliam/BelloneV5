import {
  createColumnMutation,
  updateColumnMutation,
} from "@/service/Kanban/columns/query";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "./use-toast";

const useUpdateColumns = () => {
  const update = useMutation({
    mutationFn: async (variables: any) => {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_PROTECTED_URL}/columns`, // URL de ton endpoint GraphQL
        { query: updateColumnMutation, variables: variables }
      );
    },
    onError: (error) => {
      console.error("Failed to update column:", error);
      toast({
        variant: "destructive",
        title: `Failed to update column: ${error.message}`,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.data?.updateColumn) {
        toast({
          variant: "default",
          title: "Column updated successfully!",
        });
        return data;
      } else {
        toast({
          variant: "destructive",
          title: `Failed to update Column`,
        });
      }
    },
  });
  const createColumn = useMutation({
    mutationFn: async (variables: any) => {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_PROTECTED_URL}/columns`, // URL de ton endpoint GraphQL
        { query: createColumnMutation, variables: variables }
      );
    },
    onError: (error) => {
      console.error("Failed to update column:", error);
      toast({
        variant: "destructive",
        title: `Failed to update column: ${error.message}`,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.data?.addColumn) {
        toast({
          variant: "default",
          title: "Column updated successfully!",
        });
        return data;
      } else {
        toast({
          variant: "destructive",
          title: `Failed to update Column`,
        });
      }
    },
  });
  const handleCreateColumn = async ({
    title,
    color,
    project_id,
    order,
  }: {
    title: string;
    color: string;
    project_id: string;
    order: number;
  }) => {
    return await createColumn.mutateAsync({
      title,
      color,
      project_id,
      order,
    });
  };
  const handleUpdateColumns = async ({
    id,
    title,
    color,
    project_id,
    order,
  }: {
    id: string;
    title?: string;
    color?: string;
    project_id?: string;
    order?: number;
  }) => {
    return await update.mutateAsync({
      id,
      ...(title !== undefined && { title }), // Ajoute `title` uniquement s'il n'est pas `undefined`
      ...(color !== undefined && { color }),
      ...(project_id !== undefined && { project_id }),
      ...(order !== undefined && { order }),
    });
  };

  return { handleUpdateColumns, handleCreateColumn };
};

export default useUpdateColumns;
