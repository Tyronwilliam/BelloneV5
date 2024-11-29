import {
  fetchAll,
  fetchOne,
  create,
  update,
  remove,
  getErrorMessage,
} from "@/customApi/apiService";
import { ProjectType } from "@/zodSchema/Project/project";

export const addProject = async (data: ProjectType) => {
  try {
    const newProject = await create<ProjectType>("projects", data);
    console.log("New ProjectType created:", newProject);
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout de la tâche :",
      getErrorMessage(error)
    );
  }
};
export const loadProject = async () => {
  try {
    const project: ProjectType[] = await fetchAll<ProjectType>("projects");
    console.log("List of project :", project);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des tâches :",
      getErrorMessage(error)
    );
  }
};
