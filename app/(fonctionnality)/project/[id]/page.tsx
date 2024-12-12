import Entete from "@/app/components/reusable/Entete/Entete";
import GridLayout from "../GridLayout/GridLayout";
import { ItemInterfaceType } from "@/zodSchema/Project/tasks";
import { ColumnsType } from "@/zodSchema/Kanban/columns";
import { fetchTasksByProject } from "@/service/Task/api";
import { fetchProjectsByCreator } from "@/service/Project/api";

// const GridLayout = dynamic(() => import("../GridLayout/GridLayout"));

const SingleProjectPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const projectId = (await params).id;
  //Project

  // Tasks
  let tasksData = fetchTasksByProject(projectId)
    .then((tasks) => {
      console.log("Tasks:", tasks); // Traitez les tâches récupérées
      return tasks;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  //Column KANBAN
  let columnsData = await fetch(`http://localhost:3000/KanbanColumns`);
  let columns = await columnsData.json();
  const filteredColumns = columns?.filter(
    (column: ColumnsType) => JSON.stringify(column?.project_id) === projectId
  );
  // Kanban
  let kanbanData = await fetch(`http://localhost:3000/kanban/${projectId}`);
  let kanban = await kanbanData.json();
  // COlumn & Task
  const columnsWithTasks = filteredColumns.map((column: ColumnsType) => ({
    ...column,
    items: tasksData.filter(
      (task: ItemInterfaceType) => Number(task.column_id) === Number(column.id) // Normalizing to numbers
    ),
  }));

  console.log(columnsWithTasks, "columnsWithTasks");
  // console.log(filteredTasks, " filteredTasks");
  return (
    <Entete>
      <GridLayout
        kanban={kanban}
        projectId={projectId}
        columnsWithTasks={columnsWithTasks}
      />
    </Entete>
  );
};

export default SingleProjectPage;
