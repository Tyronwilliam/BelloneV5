import { create, fetchAll, getErrorMessage } from "@/service/apiService";

import { ClientSchema } from "@/zodSchema/Client/zodSchema";

export const addClient = async (data: string) => {
  try {
    const newClient = await create<string>("clients", data);
    console.log("New Client created:", newClient);
    return newClient;
  } catch (error) {
    console.error("Erreur lors de l'ajout du client :", getErrorMessage(error));
  }
};
export const addComplexClient = async (data: typeof ClientSchema) => {
  try {
    const newClient = await create<typeof ClientSchema>("clients", data);
    console.log("New Client created:", newClient);
    return newClient;
  } catch (error) {
    console.error("Erreur lors de l'ajout du client :", getErrorMessage(error));
  }
};
export const getClient = async () => {
  try {
    const newClient = await fetchAll("clients");
    console.log("New Client created:", newClient);
    return newClient;
  } catch (error) {
    console.error("Erreur lors de l'ajout du client :", getErrorMessage(error));
  }
};
