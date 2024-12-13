export const updateColumnMutation = /* GraphQL */ `
  mutation UpdateColumn(
    $id: String!
    $title: String
    $color: String
    $project_id: String
    $order: Int
    $pseudo_id: String
  ) {
    updateColumn(
      id: $id
      title: $title
      color: $color
      project_id: $project_id
      order: $order
      pseudo_id: $pseudo_id
    ) {
      id
      title
      color
      project_id
      order
      pseudo_id
    }
  }
`;
