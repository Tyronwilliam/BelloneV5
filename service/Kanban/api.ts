export const fetchKanbansByProjectId = async (projectId: string) => {
  const query = `
      query GetKanbansByProjectId($project_id: String!) {
        kanbansByProjectId(project_id: $project_id) {
          id
          project_id
          image
          assigned_to
        }
      }
    `;

  const variables = { project_id: projectId };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_URL}/kanban`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers if needed (like authorization)
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );

    // Check if response is ok (status 200)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Return the kanbans data if the query was successful
    return result?.data?.kanbansByProjectId || [];
  } catch (error) {
    console.error("Error fetching kanbans:", error);
    throw error; // Rethrow error for further handling
  }
};

