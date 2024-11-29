import Entete from "@/app/components/reusable/Entete/Entete";
import GridLayout from "../GridLayout/GridLayout";

// const GridLayout = dynamic(() => import("../GridLayout/GridLayout"));

const SingleProjectPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const projectId = (await params).id;
  //   let projectData = await fetch(`http://localhost:3000/projects/${id}`);
  //   let project = await projectData.json();

  let tasksData = await fetch(`http://localhost:3000/tasks/${projectId}`);
  let tasks = await tasksData.json();
  let kanbanData = await fetch(`http://localhost:3000/kanban/${projectId}`);
  let kanban = await kanbanData.json();

  console.log(tasks);
  return (
    <Entete>
      <GridLayout tasks={tasks} kanban={kanban} projectId={projectId} />
    </Entete>
  );
};

export default SingleProjectPage;
