import { updateColumnMutation } from "@/service/Kanban/columns/query";
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

      throw new Error(error?.message);
    },
    onSuccess: (data) => {
      console.log("Column updated successfully:", data);
      return data;
    },
  });

  const handleUpdateColumns = ({
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
    return update.mutate({
      id,
      ...(title !== undefined && { title }), // Ajoute `title` uniquement s'il n'est pas `undefined`
      ...(color !== undefined && { color }),
      ...(project_id !== undefined && { project_id }),
      ...(order !== undefined && { order }),
    });
  };

  return { handleUpdateColumns };
};

export default useUpdateColumns;
