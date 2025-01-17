import { GET_PROJECT_BY_CREATOR } from "./query";

export const fetchProjectsByCollaborator = async (creator: string) => {
  const variables = {
    creator: creator,
  };
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_URL}/project`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GET_PROJECT_BY_CREATOR,
          variables,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return result?.data?.projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error; 
  }
};
