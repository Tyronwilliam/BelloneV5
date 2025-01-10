import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  GET_COLLABORATORS_BY_CREATOR_ID,
  GET_COLLABORATORS_BY_PROJECT_ID,
} from "./query";

async function getCollaboratorsByProjectId(projectId: string) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_PROTECTED_URL}/collaborators`, {
      query: GET_COLLABORATORS_BY_PROJECT_ID,
      variables: { projectId },
    })
    .then((response) => {
      if (response.data.errors) {
        throw new Error(
          response.data.errors.map((error: any) => error.message).join(", ")
        );
      }
      return response.data.data.collaboratorsByProjectId;
    })
    .catch((error) => {
      console.error("Erreur capturée dans collaboratorsByCreator:", error);
      throw error; 
    });
}
async function getCollaboratorsByCreatorId(creatorId: string) {
  const variables = { creator: creatorId };
  return await axios
    .post(`${process.env.NEXT_PUBLIC_PROTECTED_URL}/collaborators`, {
      query: GET_COLLABORATORS_BY_CREATOR_ID,
      variables,
    })
    .then((response) => {
      if (response.data.errors) {
        throw new Error(
          response.data.errors.map((error: any) => error.message).join(", ")
        );
      }
      return response.data.data.collaboratorsByCreator;
    })
    .catch((error) => {
      console.error("Erreur capturée dans collaboratorsByCreator:", error);
      throw error; 
    });
}

export const Collabo = {
  GetCollaboByProjectId: {
    useQuery: (
      projectId: string,
      options?: UseQueryOptions<any, AxiosError>
    ) => {
      return useQuery({
        queryKey: ["collaboratorsByProjectId", projectId],
        queryFn: () => getCollaboratorsByProjectId(projectId),
        enabled: !!projectId,
        ...options,
      });
    },
  },
  GetCollaboByCreatorId: {
    useQuery: (
      creatorId: string,
      options?: UseQueryOptions<any, AxiosError>
    ) => {
      return useQuery({
        queryKey: ["collaboratorsByCreatorId", creatorId],
        queryFn: () => getCollaboratorsByCreatorId(creatorId),
        enabled: !!creatorId,
        ...options,
      });
    },
  },
};
