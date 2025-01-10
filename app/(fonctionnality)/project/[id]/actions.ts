"use server";
import { GET_COLUMNS_BY_PROJECT_ID } from "@/service/Kanban/columns/query";
import { GET_TASKS_BY_PROJECT_ID } from "@/service/Task/query";
import { ColumnsType } from "@/zodSchema/Kanban/columns";
import { TaskInterfaceType } from "@/zodSchema/Project/tasks";

export const fetchTasksByProject = async (projectId: string) => {
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
          query: GET_TASKS_BY_PROJECT_ID,
          variables,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result?.data?.tasksByProject || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
export async function getColumnsByProjectId(projectId: string) {
  const variables = { project_id: projectId };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_URL}/columns`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: GET_COLUMNS_BY_PROJECT_ID,
        variables,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching columns: ${response.statusText}`);
  }

  const result = await response.json();
  return result?.data?.columnsByProjectId || [];
}
export async function getColumnsWithTasks(projectId: string) {
  try {
    const tasksData = await fetchTasksByProject(projectId);
    const columnsData = await getColumnsByProjectId(projectId);
    console.log(columnsData);

    const columnsWithTasks = columnsData.map((column: ColumnsType) => {
      const tasksForColumn = tasksData.filter(
        (task: TaskInterfaceType) => task.column_id === column.id
      );
      return {
        ...column,
        items: tasksForColumn,
      };
    });

    return columnsWithTasks;
  } catch (error) {
    console.error("Error fetching columns or tasks:", error);
    throw error;
  }
}
