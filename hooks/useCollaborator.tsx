import { getCollaboratorsByProjectId } from "@/service/Collaborators/query";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "./use-toast";

const useCollaborator = () => {
  const getCollaboratorByProjectId = useMutation({
    mutationFn: async (variables: { projectId: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PROTECTED_URL}/collaborators`, // URL for your GraphQL endpoint
        {
          query: getCollaboratorsByProjectId, // Your GraphQL query
          variables, // Variables passed to the query
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      console.error("Failed to fetch collaborators:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch collaborators: ${error.message}`,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.collaboratorsByProjectId) {
        toast({
          variant: "default",
          title: "Collaborators fetched successfully!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to fetch collaborators",
        });
      }
    },
  });
  const handleGetCollaboratorByProjectId = async ({
    projectId,
  }: {
    projectId: string;
  }) => {
    try {
      const response = await getCollaboratorByProjectId.mutateAsync({
        projectId,
      });
      return response;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error; // If you want to propagate the error
    }
  };
  return {
    handleGetCollaboratorByProjectId,
  };
};

export default useCollaborator;
