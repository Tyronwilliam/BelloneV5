export const createCollaborator = `mutation AddCollaborator($projectId: String!, $roles: [RoleInput]!, $creator: String!, $email: String!, $phone: String, $notes: String, $address: AddressInput) {
  addCollaborator(
    projectId: $projectId,
    roles: $roles,
    creator: $creator,
    email: $email,
    phone: $phone,
    notes: $notes,
    address: $address
  ) {
    id
    projectId
    userId
    roles {
      projectId
      role
    }
    creator
    email
    phone
    notes
    address {
      street
      city
      postalCode
      country
    }
  }
}

`;

export const GET_COLLABORATORS_BY_PROJECT_ID = `query CollaboratorsByProjectId($projectId: String!) { collaboratorsByProjectId(projectId: $projectId) { id projectId userId roles { projectId role } creator } }`;
