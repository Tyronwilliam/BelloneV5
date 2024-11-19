import {
  fetchAll,
  fetchOne,
  create,
  update,
  remove,
  getErrorMessage,
} from "@/customApi/apiService";
import { Project } from "@/zodSchema/Project/type";

export const addProject = async (data: Project) => {
  try {
    const newProject = await create<Project>("projects", data);
    console.log("New Project created:", newProject);
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout de la tâche :",
      getErrorMessage(error)
    );
  }
};
export const loadProject = async () => {
  try {
    const project: Project[] = await fetchAll<Project>("projects");
    console.log("List of project :", project);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des tâches :",
      getErrorMessage(error)
    );
  }
};
