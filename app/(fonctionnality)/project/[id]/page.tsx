import Entete from "@/app/components/reusable/Entete/Entete";
import GridLayout from "../GridLayout/GridLayout";

// const GridLayout = dynamic(() => import("../GridLayout/GridLayout"));

const SingleProjectPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  //   let projectData = await fetch(`http://localhost:3000/projects/${id}`);
  //   let project = await projectData.json();

  let tasksData = await fetch(`http://localhost:3000/tasks/${id}`);
  let tasks = await tasksData.json();
  let kanbanData = await fetch(`http://localhost:3000/kanban/${id}`);
  let kanban = await kanbanData.json();

  console.log(tasks);
  return (
    <Entete>
      <GridLayout tasks={tasks} kanban={kanban} />
    </Entete>
  );
};

export default SingleProjectPage;
