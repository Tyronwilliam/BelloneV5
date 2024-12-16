export const updateTaskMutation = /* GraphQL */ `
  mutation UpdateTasks(
    $id: String!
    $title: String
    $description: String
    $start_date: Int
    $due_date: Int
    $time: Int
    $members: [String]
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
      members
      column_id
      project_id
      order
      pseudo_id
    }
  }
`;