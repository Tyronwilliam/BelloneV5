import { ColumnsType } from "@/zodSchema/Kanban/columns";
import { fetchColumnsByProjectId } from "../Kanban/columns/api";
import { ItemInterfaceType } from "@/zodSchema/Project/tasks";

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
        pseudo_id
        order
      }
    }
  `;

  const variables = { project_id: projectId };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_URL}/task`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );

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
// Assuming fetchTasksByProject and fetchColumnsByProjectId are already defined
export async function getColumnsWithTasks(projectId: string) {
  try {
    // Fetch tasks for the given project
    const tasksData = await fetchTasksByProject(projectId);

    // Fetch columns for the given project
    const columnsData = await fetchColumnsByProjectId(projectId);

    // Map columns and associate tasks with each column
    const columnsWithTasks = columnsData.map((column: ColumnsType) => {
      const tasksForColumn = tasksData.filter(
        (task: ItemInterfaceType) => task.column_id === column.id
      );
      return {
        ...column,
        items: tasksForColumn, // Attach the tasks to the column
      };
    });

    return columnsWithTasks; // Return the columns with tasks
  } catch (error) {
    console.error("Error fetching columns or tasks:", error);
    throw error; // Rethrow error to be handled by the calling function
  }
}
