export const fetchTasksByProject = async (projectId: string) => {
  const query = `
    query GetTasksByProject($project_id: String!) {
      tasksByProject(project_id: $project_id) {
        id
        title
        description
        start_date
        due_date
        members
        column_id
        project_id
      }
    }
  `;

  const variables = { project_id: projectId };

  try {
    const response = await fetch(`${process.env.PROTECTED_URL}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    // Vérification de la réponse du serveur
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return result?.data?.tasksByProject || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Relance l'erreur après l'avoir loggée
  }
};
