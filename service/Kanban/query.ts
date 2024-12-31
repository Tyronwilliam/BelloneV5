export const GET_KANBAN_BY_PROJECT_ID = `
query GetKanbansByProjectId($project_id: String!) {
  kanbansByProjectId(project_id: $project_id) {
    id
    project_id
    image
    assigned_to
  }
}
`;
