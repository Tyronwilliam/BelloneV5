import { gql } from "@apollo/client";
export const fetchTasksByProject = async (projectId: string) => {
  const query = `
    query GetTasksByProject($project_id: ID!) {
      tasksByProject(project_id: $project_id) {
        id
        title
        description
        start_date
        due_date
        members
        column_id
        
      }
    }
  `;

  const variables = { project_id: projectId };

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

  const result = await response.json();
  return result?.data?.task;
};
export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $start_date: Int
    $due_date: Int
    $time: Int
    $members: [String]  // Utilisez [String] pour un tableau d'IDs de membres
    $column_id: String
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      start_date: $start_date
      due_date: $due_date
      time: $time
      members: $members
      column_id: $column_id
    ) {
      id
      title
      description
      start_date
      due_date
      time
      members
      column_id
      
    }
  }
`;
