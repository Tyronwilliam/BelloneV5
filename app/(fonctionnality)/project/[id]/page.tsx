import Entete from "@/app/components/reusable/Entete/Entete";
import { fetchKanbansByProjectId } from "@/service/Kanban/api";
import { KanbanType } from "@/zodSchema/Kanban/kanban";
import GridLayout from "../GridLayout/GridLayout";
import { getColumnsWithTasks } from "@/service/Task/uncommon";

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

  const columnsWithTasks = await getColumnsWithTasks(projectId); // Return the columns with tasks
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
