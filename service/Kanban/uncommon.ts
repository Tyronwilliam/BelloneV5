import { GET_KANBAN_BY_PROJECT_ID } from "./query";

export const fetchKanbansByProjectId = async (projectId: string) => {
  const variables = { project_id: projectId };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_URL}/kanban`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GET_KANBAN_BY_PROJECT_ID,
          variables,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return result?.data?.kanbansByProjectId || [];
  } catch (error) {
    console.error("Error fetching kanbans:", error);
    throw error; 
  }
};
