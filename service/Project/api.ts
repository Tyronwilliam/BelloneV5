export const fetchProjectsByCreator = async (creatorId: string | number) => {
  const query = `
    query GetProjects($creator: Int!) {
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

  const variables = {
    creator: creatorId,
  };

  const response = await fetch(`${process.env.PROTECTED_URL}/project`, {
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
  return result?.data?.projects;
};

// Usage example
