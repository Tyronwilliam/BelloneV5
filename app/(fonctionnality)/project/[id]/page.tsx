import Entete from "@/app/components/reusable/Entete/Entete";
import { fetchKanbansByProjectId } from "@/service/Kanban/api";
import { fetchColumnsByProjectId } from "@/service/Kanban/columns/api";
import { fetchTasksByProject, getColumnsWithTasks } from "@/service/Task/api";
import { ColumnsType } from "@/zodSchema/Kanban/columns";
import { KanbanType } from "@/zodSchema/Kanban/kanban";
import GridLayout from "../GridLayout/GridLayout";
import { ItemInterfaceType } from "@/zodSchema/Project/tasks";

// const GridLayout = dynamic(() => import("../GridLayout/GridLayout"));

const SingleProjectPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const projectId = (await params).id;
  let kanbanData = await fetchKanbansByProjectId(projectId)
    .then((kanbans: KanbanType) => {
      return kanbans;
    })
    .catch((error) => {
      console.error("Error fetching kanbans:", error); // Handle the error
    });
  // Tasks
  let tasksData = await fetchTasksByProject(projectId)
    .then((tasks) => {
      console.log("Tasks:", tasks); // Traitez les tâches récupérées
      return tasks;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  //Column KANBAN
  const columnsData = await fetchColumnsByProjectId(projectId)
    .then((columns: ColumnsType[]) => {
      console.log("Columns:", columns); // Process the columns data
      return columns;
    })
    .catch((error) => {
      console.error("Error fetching columns:", error); // Handle the error
    });

  const columnsWithTasks = await getColumnsWithTasks(projectId);
  console.log(columnsWithTasks, "COLUMN & TASK");
  return (
    <Entete>
      {/* <p>HELLO</p> */}
      <GridLayout
        kanban={kanbanData!}
        projectId={projectId}
        columnsWithTasks={columnsWithTasks}
      />
    </Entete>
  );
};

export default SingleProjectPage;
