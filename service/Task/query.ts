export const UPDATE_TASK_MUTATION = /* GraphQL */ `
  mutation UpdateTasks(
    $id: String!
    $title: String
    $description: String
    $start_date: Float
    $due_date: Float
    $time: Int
    $members: [MemberInputType]
    $column_id: String
    $project_id: String
    $order: Int
    $pseudo_id: String
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
      project_id: $project_id
      order: $order
      pseudo_id: $pseudo_id
    ) {
      id
      title
      description
      start_date
      due_date
      time
      members {
        id
        email
      }
      column_id
      project_id
      order
      pseudo_id
      completeAt
    }
  }
`;
export const CREATE_TASK_MUTATION = `
mutation CreateTask(
  $project_id: String,
  $title: String!,
  $description: String!,
  $start_date: Float,
  $due_date: Float,
  $time: Int!,
  $members: [MemberInputType!]!,
  $column_id: String!,
  $order: Int,
  $completeAt :Float
) {
  createTask(
    project_id: $project_id,
    title: $title,
    description: $description,
    start_date: $start_date,
    due_date: $due_date,
    time: $time,
    members: $members,
    column_id: $column_id,
    order: $order,
    completeAt : $completeAt
  ) {
       id
      title
      description
      start_date
      due_date
      time
      members {
      id
      email
    }
      column_id
      project_id
      order
      pseudo_id
      completeAt
  }
}
`;
export const GET_TASKS_BY_PROJECT_ID = `
query GetTasksByProject($project_id: String!) {
  tasksByProject(project_id: $project_id) {
     id
      title
      description
      start_date
      due_date
      time
      members {
      id
      email
    }
      column_id
      project_id
      order
      pseudo_id
      completeAt
  }
}
`;
export const DELETE_TASK = `
mutation deleteTask($id: String!) {
  deleteTask(id: $id)
}
`;
