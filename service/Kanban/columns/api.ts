export const fetchColumnsByProjectId = async (projectId: string) => {
  const query = `
      query GetColumnsByProjectId($project_id: String!) {
        columnsByProjectId(project_id: $project_id) {
          id
          title
          color
          project_id
          order
          pseudo_id
        }
      }
    `;

  const variables = { project_id: projectId };

  try {
    const response = await fetch(`${process.env.PROTECTED_URL}/columns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers if needed (like authorization)
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    // Check if response is ok (status 200)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Return the columns data if the query was successful
    return result?.data?.columnsByProjectId || [];
  } catch (error) {
    console.error("Error fetching columns:", error);
    throw error; // Rethrow error for further handling
  }
};
