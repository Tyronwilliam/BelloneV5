import Entete from "@/app/components/reusable/Entete/Entete";
import { fetchKanbansByProjectId } from "@/service/Kanban/api";
import { fetchColumnsByProjectId } from "@/service/Kanban/columns/api";
import { fetchTasksByProject } from "@/service/Task/api";
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
  //Project

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

  // const filteredColumns = columns?.filter(
  //   (column: ColumnsType) => JSON.stringify(column?.project_id) === projectId
  // );
  // Kanban
  let kanbanData = await fetchKanbansByProjectId(projectId)
    .then((kanbans: KanbanType) => {
      return kanbans;
    })
    .catch((error) => {
      console.error("Error fetching kanbans:", error); // Handle the error
    });

  const columnsWithTasks = columnsData?.map((column: ColumnsType) => {
    console.log("Column ID:", column.id); // Vérifier l'ID de la colonne
    const tasksForColumn = tasksData.filter(
      (task: ItemInterfaceType) => task.column_id === column.id
    );
    console.log("Tasks for column:", tasksForColumn); // Vérifier les tâches filtrées
    return {
      ...column,
      items: tasksForColumn,
    };
  });

  console.log(tasksData, "tasksData");

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
