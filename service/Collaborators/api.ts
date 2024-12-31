import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  GET_COLLABORATORS_BY_CREATOR_ID,
  GET_COLLABORATORS_BY_PROJECT_ID,
} from "./query";

async function getCollaboratorsByProjectId(projectId: string) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_PROTECTED_URL}/collaborators`,
    { query: GET_COLLABORATORS_BY_PROJECT_ID, variables: { projectId } }
  );
  return response.data?.data?.collaboratorsByProjectId;
}
async function getCollaboratorsByCreatorId(creatorId: string) {
  const variables = { creator: creatorId };
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_PROTECTED_URL}/collaborators`,
    { query: GET_COLLABORATORS_BY_CREATOR_ID, variables }
  );
  return response.data?.data?.collaboratorsByCreator;
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
