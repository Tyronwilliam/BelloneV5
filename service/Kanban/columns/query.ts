export const UPDATE_COLUMN_MUTATION = /* GraphQL */ `
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

export const CREATE_COLUMN_MUTATION = `
  mutation AddColumn($title: String, $color: String, $project_id: String!, $order: Int!) {
    addColumn(
      title: $title
      color: $color
      project_id: $project_id
      order: $order
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
export const GET_COLUMNS_BY_PROJECT_ID = `
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
