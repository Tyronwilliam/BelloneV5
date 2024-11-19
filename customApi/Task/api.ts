import {
  fetchAll,
  fetchOne,
  create,
  update,
  remove,
  getErrorMessage,
} from "@/customApi/apiService";

interface Task {
  id: number;
  title: string;
  description: string;
}

// Utilisation de la fonction utilitaire
const loadTasks = async () => {
  try {
    const tasks: Task[] = await fetchAll<Task>("tasks");
    console.log("Liste des tâches :", tasks);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des tâches :",
      getErrorMessage(error)
    );
  }
};

const addTask = async (task: Task) => {
  try {
    const newTask = await create<Task>("tasks", task);
    console.log("Nouvelle tâche ajoutée :", newTask);
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout de la tâche :",
      getErrorMessage(error)
    );
  }
};
