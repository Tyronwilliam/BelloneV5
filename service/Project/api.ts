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
  try {
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

    // Vérification de la réponse du serveur
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return result?.data?.projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error; // Relance l'erreur après l'avoir loggée
  }

};

// Usage example
