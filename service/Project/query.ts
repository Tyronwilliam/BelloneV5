export const GET_PROJECT_BY_CREATOR = `
query GetProjects($creator: String) {
  projects(creator: $creator) {
    id
    title
    description
    clientId
    budget
    startDate
    endDate
    status
    progress
    creator
    time
    image
  }
}
`;
