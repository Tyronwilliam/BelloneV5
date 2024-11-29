import { create, fetchAll, getErrorMessage } from "@/customApi/apiService";
import { ItemInterfaceType } from "@/zodSchema/Project/tasks";
import { UniqueIdentifier } from "@dnd-kit/core";

// Utilisation de la fonction utilitaire
const loadTasks = async () => {
  try {
    const tasks: ItemInterfaceType[] = await fetchAll<ItemInterfaceType>(
      "tasks"
    );
    console.log("Liste des tâches :", tasks);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des tâches :",
      getErrorMessage(error)
    );
  }
};

const addTask = async (task: ItemInterfaceType) => {
  try {
    const newTask = await create<ItemInterfaceType>("tasks", task);
    console.log("Nouvelle tâche ajoutée :", newTask);
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout de la tâche :",
      getErrorMessage(error)
    );
  }
};
